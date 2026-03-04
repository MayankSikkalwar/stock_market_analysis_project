from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import yfinance as yf

app = FastAPI(title="Stock Market Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STOCKS = [
    "RELIANCE.NS",
    "HDFCBANK.NS",
    "TCS.NS",
    "ITC.NS",
    "SUNPHARMA.NS",
]

TIMEFRAME_TO_PERIOD = {
    "1M": "1mo",
    "3M": "3mo",
    "6M": "6mo",
    "1Y": "1y",
}


@app.get("/api/stocks")
def get_stocks():
    return {"stocks": STOCKS}


@app.get("/api/historical/{ticker}")
def get_historical_data(
    ticker: str, timeframe: str = Query("1M", description="1M, 3M, 6M, or 1Y")
):
    tf = timeframe.upper()
    if tf not in TIMEFRAME_TO_PERIOD:
        raise HTTPException(status_code=400, detail="Invalid timeframe. Use 1M, 3M, 6M, or 1Y.")

    period = TIMEFRAME_TO_PERIOD[tf]
    data = yf.Ticker(ticker).history(period=period, interval="1d")
    if data.empty:
        raise HTTPException(status_code=404, detail=f"No historical data found for ticker: {ticker}")

    response = []
    for index, row in data.iterrows():
        response.append(
            {
                "date": index.strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]),
            }
        )

    return {"ticker": ticker, "timeframe": tf, "candles": response}


@app.get("/api/analysis/{ticker}")
def get_analysis(ticker: str):
    stock = yf.Ticker(ticker)
    data = stock.history(period="1y", interval="1d")
    if data.empty:
        raise HTTPException(status_code=404, detail=f"No analysis data found for ticker: {ticker}")

    df = data[["Close", "Volume"]].copy()

    # 1) SMA calculations for trend detection
    df["SMA50"] = df["Close"].rolling(window=50).mean()
    df["SMA200"] = df["Close"].rolling(window=200).mean()
    latest = df.iloc[-1]
    sma_50 = None if pd.isna(latest["SMA50"]) else float(latest["SMA50"])
    sma_200 = None if pd.isna(latest["SMA200"]) else float(latest["SMA200"])
    trend = "Insufficient data"
    if sma_50 is not None and sma_200 is not None:
        trend = "Bullish" if sma_50 > sma_200 else "Bearish"

    # 2) K-Means clustering for support/resistance levels (last 6 months close prices)
    close_6m = df["Close"].dropna().tail(126).values.reshape(-1, 1)
    num_clusters = min(4, len(close_6m))
    sr_levels = []
    if num_clusters > 0:
        kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
        kmeans.fit(close_6m)
        sr_levels = sorted(float(center[0]) for center in kmeans.cluster_centers_)

    # 3) Isolation Forest on volume for anomaly detection
    anomalies = []
    vol_df = df[["Volume"]].dropna().copy()
    if len(vol_df) >= 10:
        iso = IsolationForest(contamination=0.05, random_state=42)
        vol_df["anomaly"] = iso.fit_predict(vol_df[["Volume"]])
        anomaly_rows = vol_df[vol_df["anomaly"] == -1]
        anomalies = [
            {
                "date": index.strftime("%Y-%m-%d"),
                "volume": int(row["Volume"]),
            }
            for index, row in anomaly_rows.iterrows()
        ]

    # 4) NLP sentiment analysis on recent news headlines using VADER
    # VADER (Valence Aware Dictionary and sEntiment Reasoner) is a lexicon + rule-based NLP model.
    # It maps words/phrases to sentiment intensity and applies heuristics (negation, capitalization,
    # punctuation emphasis, degree modifiers like "very") to produce robust sentiment for short text
    # such as financial/news headlines.
    analyzer = SentimentIntensityAnalyzer()
    headlines = []
    headline_sentiments = []
    sentiment_error = None

    # yfinance news can fail (network, upstream API changes, ticker without coverage), so we wrap
    # extraction in try/except and return a safe fallback payload rather than breaking the whole endpoint.
    try:
        raw_news = stock.news or []
        for item in raw_news[:10]:
            title = (item.get("title") or "").strip()
            if not title:
                continue
            headlines.append(title)

            # VADER returns: neg, neu, pos, compound.
            # `compound` is the normalized weighted composite score in [-1, 1], where:
            # -1 is most negative, +1 is most positive, and values near 0 are neutral/mixed.
            score = analyzer.polarity_scores(title)
            headline_sentiments.append(
                {
                    "headline": title,
                    "compound": float(score["compound"]),
                    "positive": float(score["pos"]),
                    "neutral": float(score["neu"]),
                    "negative": float(score["neg"]),
                }
            )
    except Exception as exc:
        sentiment_error = f"Failed to fetch or parse news from yfinance: {str(exc)}"

    overall_compound = 0.0
    if headline_sentiments:
        overall_compound = float(
            sum(item["compound"] for item in headline_sentiments) / len(headline_sentiments)
        )

    # Standard VADER interpretation thresholds:
    # compound > 0.05  => positive sentiment (Bullish)
    # compound < -0.05 => negative sentiment (Bearish)
    # otherwise        => neutral sentiment
    # These thresholds come from VADER's recommended calibration and help avoid overreacting
    # to very small score fluctuations around zero.
    if overall_compound > 0.05:
        sentiment_label = "Bullish"
    elif overall_compound < -0.05:
        sentiment_label = "Bearish"
    else:
        sentiment_label = "Neutral"

    return {
        "ticker": ticker,
        "trend_analysis": {
            "sma_50": sma_50,
            "sma_200": sma_200,
            "trend": trend,
        },
        "support_resistance_levels": sr_levels,
        "volume_anomalies": anomalies,
        "news_sentiment": {
            "overall_compound_score": overall_compound,
            "label": sentiment_label,
            "headlines_analyzed": len(headline_sentiments),
            "headlines": headlines,
            "headline_sentiments": headline_sentiments,
            "error": sentiment_error,
        },
    }
