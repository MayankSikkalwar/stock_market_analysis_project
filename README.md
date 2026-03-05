# FinVise AI - Institutional-Grade NSE Intelligence Terminal

FinVise AI is a production-ready, full-stack market intelligence platform for the National Stock Exchange (NSE). It combines real-time market analytics, explainable machine learning signals, and a context-aware AI assistant into a single terminal-style interface.

## Live Deployment

- Frontend URL: `https://<your-frontend-url>`
- Backend URL: `https://<your-backend-url>`

## Project Objective

Build an institutional-style decision-support terminal that helps users analyze price structure, detect anomalous activity, interpret news sentiment, and query an AI advisor grounded in live market context.

## Stock Selection Justification

The platform focuses on five NSE leaders selected to provide broad sectoral diversification across the core engines of the Indian economy:

- `RELIANCE.NS` (Reliance Industries): Energy + Conglomerate exposure
- `HDFCBANK.NS` (HDFC Bank): Financials and credit-cycle sensitivity
- `TCS.NS` (Tata Consultancy Services): IT services and export-led digital demand
- `ITC.NS` (ITC Limited): FMCG/defensive consumption profile
- `SUNPHARMA.NS` (Sun Pharmaceutical): Healthcare and pharma resilience

This basket intentionally balances cyclicals, defensives, domestic consumption, and global-revenue businesses to support robust cross-sector signal comparison.

## Dual-Role Engineering Architecture

This project demonstrates two complementary engineering competencies:

### Full-Stack Developer Scope

- Frontend built with `Vite` + `React`
- Utility-first styling using `Tailwind CSS v4`
- Financial chart rendering with `Lightweight Charts`
- Modular dashboard architecture (`ChartWidget`, `AITrendWidget`, `ChatbotWidget`, shared state in `App.jsx`)
- Environment-driven API routing for production (`VITE_API_URL`)

### AI/ML Engineer Scope

- ML-driven support/resistance inference from market structure
- Unsupervised anomaly detection for unusual volume events
- NLP sentiment scoring over live financial/news text
- Context-aware LLM pipeline with retrieval and structured prompt grounding

## Machine Learning Pipeline

FinVise AI uses a layered ML pipeline to convert raw market data into actionable intelligence:

### 1) K-Means Clustering (Support/Resistance Estimation)

- Price zones are clustered to identify repeatedly visited levels.
- Cluster centroids are projected as candidate support/resistance regions.
- This reduces noise and improves structural interpretation versus naive single-point highs/lows.

### 2) Isolation Forest (Volume Anomaly Detection)

- Volume series is evaluated with Isolation Forest to detect statistically rare surges.
- Detected anomalies are surfaced on chart as yellow downward arrows for quick visual triage.
- This helps identify potential distribution, event-driven flow, or unusual participation spikes.

### 3) VADER NLP (Live News Sentiment)

- Incoming headlines/text are normalized and scored with VADER.
- Compound sentiment is mapped to bullish/neutral/bearish context.
- Sentiment signal is integrated with technical/volume cues for richer multi-factor interpretation.

## AI Agent: Context-Aware RAG Pipeline (Groq + Llama 3)

The chatbot is not a generic prompt wrapper. It follows a contextual retrieval-augmented process:

1. Collect active terminal context (selected stock, timeframe, latest analytics).
2. Retrieve relevant structured signals (trend, levels, anomalies, sentiment).
3. Build a constrained prompt with grounded evidence.
4. Generate response via `Groq` inference using `Llama 3`.
5. Return concise analysis aligned with current market state.

Result: faster, context-sensitive outputs with lower hallucination risk than unconstrained chat completion.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS v4
- Lightweight Charts

### Backend

- FastAPI
- Uvicorn
- yFinance
- pandas, numpy
- scikit-learn
- NLTK + VADER Sentiment
- Groq SDK

## Repository Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/dashboard/
│   │       ├── ChartWidget.jsx
│   │       ├── AITrendWidget.jsx
│   │       └── ChatbotWidget.jsx
├── main.py
├── requirements.txt
├── Procfile
└── README.md
```

## Local Setup and Run

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd Stock_Market_Analysis_project
```

### 2) Backend setup

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Create backend environment file:

```env
GROQ_API_KEY=your_groq_api_key
```

Run backend:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3) Frontend setup

```bash
cd frontend
npm install
```

Create frontend environment file (`frontend/.env`):

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run frontend:

```bash
npm run dev
```

## Production Deployment

### Backend (Render)

- Build command: `pip install -r requirements.txt`
- Start command (or Procfile): `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set environment variable: `GROQ_API_KEY`

### Frontend

- Deploy Vite build to your hosting provider.
- Set `VITE_API_URL` to deployed backend URL.
- Ensure backend CORS allows frontend domain.

## Evaluation Highlights

- End-to-end ownership across UI engineering, backend APIs, ML analytics, and LLM integration
- Production deployment readiness (env-based configuration + Render Procfile)
- Explainable multi-factor intelligence instead of single-indicator heuristics
- Assignment-aligned sector-diversified NSE coverage for analytical breadth

## License

For academic/portfolio demonstration purposes.
