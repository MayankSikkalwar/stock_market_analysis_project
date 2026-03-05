# 🚀 FinVise AI — Institutional-Grade NSE Intelligence Terminal

![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Python](https://img.shields.io/badge/Python-ML-yellow)
![Groq](https://img.shields.io/badge/LLM-Groq-orange)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

**FinVise AI** is a **full-stack AI-powered market intelligence terminal** for the **National Stock Exchange (NSE)**.

It combines:

* 📊 Real-time market analytics
* 🧠 Machine learning based market signals
* 📰 News sentiment intelligence
* 🤖 Context-aware AI trading assistant

into a **single institutional-style dashboard interface**.

The system transforms **raw market data → intelligent decision signals** using a layered AI pipeline.

---

# 🌐 Live Deployment
[https://finvise-ai-sandy.vercel.app/](https://finvise-ai-sandy.vercel.app/)


---


# 🎯 Project Objective

FinVise AI was designed to simulate an **institutional-grade decision support terminal** similar to tools used by professional analysts.

The platform helps users:

* Analyze **price structure**
* Detect **volume anomalies**
* Interpret **news sentiment**
* Query an **AI assistant grounded in live market context**

---

# 📈 Stock Selection Strategy

The platform focuses on **five NSE leaders** representing major sectors of the Indian economy.

| Stock        | Sector                |
| ------------ | --------------------- |
| RELIANCE.NS  | Energy / Conglomerate |
| HDFCBANK.NS  | Financial Services    |
| TCS.NS       | IT & Technology       |
| ITC.NS       | FMCG / Consumer       |
| SUNPHARMA.NS | Healthcare / Pharma   |

This diversified basket enables **cross-sector signal comparison**.

---

# 🧠 Machine Learning Intelligence Layer

FinVise AI converts market data into **actionable intelligence** using multiple ML models.

---

## 1️⃣ K-Means Clustering — Support & Resistance Detection

Price levels are clustered to identify **repeated market interaction zones**.

Instead of naive highs/lows, clustering reveals **true structural levels**.

**Output**

• Support zones
• Resistance zones
• Market structure interpretation

---

## 2️⃣ Isolation Forest — Volume Anomaly Detection

The model identifies **statistically rare volume spikes**.

These spikes often indicate:

* Institutional activity
* Event-driven trading
* Market distribution phases

Detected anomalies appear on the chart as:

⬇ Yellow arrows

---

## 3️⃣ VADER NLP — News Sentiment Intelligence

Financial news headlines are processed using **VADER sentiment analysis**.

Sentiment scores classify market tone as:

* 🟢 Bullish
* ⚪ Neutral
* 🔴 Bearish

The sentiment signal is combined with **technical signals** for multi-factor analysis.

---

# 🤖 AI Market Assistant (RAG Pipeline)

The chatbot uses a **Retrieval-Augmented Generation architecture**.

Instead of generic LLM responses, it follows a structured pipeline:

1️⃣ Collect terminal context
(selected stock, timeframe, analytics)

2️⃣ Retrieve structured signals
(trend, sentiment, anomalies)

3️⃣ Build grounded prompt

4️⃣ Generate response using **Groq + Llama 3**

5️⃣ Return concise market analysis

### Result

⚡ Faster responses
🧠 Context-aware answers
📉 Reduced hallucination risk

---

# ⚙️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS v4
* Lightweight Charts

## Backend

* FastAPI
* Uvicorn
* gnews

## Machine Learning

* pandas
* numpy
* scikit-learn

## NLP

* NLTK
* VADER Sentiment

## AI

* Groq SDK
* Llama 3

---

# 🏗 System Architecture

```
Market Data (yFinance)
        │
        ▼
Data Processing (pandas / numpy)
        │
        ▼
ML Analytics Layer
 ├─ K-Means (Support/Resistance)
 ├─ Isolation Forest (Volume Anomaly)
 └─ VADER NLP (News Sentiment)
        │
        ▼
FastAPI Backend
        │
        ▼
React Dashboard
        │
        ▼
AI Assistant (Groq + Llama 3)
```

---

# 📂 Repository Structure

```
FinVise-AI
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   └── components/dashboard
│   │       ├── ChartWidget.jsx
│   │       ├── AITrendWidget.jsx
│   │       └── ChatbotWidget.jsx
│
├── main.py
├── requirements.txt
├── Procfile
└── README.md
```

---

# ⚡ Local Setup

## 1️⃣ Clone Repository

```
git clone <your-repo-url>
cd FinVise-AI
```

---

## 2️⃣ Backend Setup

```
python -m venv .venv
```

Activate environment

Windows

```
.venv\Scripts\activate
```

Mac/Linux

```
source .venv/bin/activate
```

Install dependencies

```
pip install -r requirements.txt
```

Create `.env`

```
GROQ_API_KEY=your_groq_api_key
```

Run backend

```
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

## 3️⃣ Frontend Setup

```
cd frontend
npm install
```

Create `.env`

```
VITE_API_URL=http://127.0.0.1:8000
```

Run frontend

```
npm run dev
```

---

# 🚀 Production Deployment

## Backend (Render)

Build command

```
pip install -r requirements.txt
```

Start command

```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Environment Variable

```
GROQ_API_KEY
```

---

## Frontend

Deploy using:

* Vercel
* Netlify
* Cloudflare

Set environment variable:

```
VITE_API_URL=<backend-url>
```

---

# ⭐ Key Highlights

✔ Full-stack AI application
✔ Real-time financial analytics
✔ Explainable ML signals
✔ RAG-based AI assistant
✔ Institutional-style dashboard
✔ Production deployment ready

---

# 👨‍💻 Author

**Mayank Sikkalwar**

Computer Science Engineering Student
AI / ML • Full Stack Development • Financial AI Systems

---

# 📜 License

This project is developed for **academic and portfolio demonstration purposes**.
