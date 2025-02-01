import yfinance as yf
import pandas_ta as ta
from forex_python.converter import CurrencyRates
import pandas as pd


def fetch_stock_price(symbol: str, timeframe: str = "daily"):
    """Fetch real-time or historical stock prices using Yahoo Finance."""
    stock = yf.Ticker(symbol)
    data = stock.history(period="1mo")  # Fetch last 1-month data

    if data.empty:
        return f"Stock symbol '{symbol}' not found."

    latest_data = data.iloc[-1]  # Most recent row

    response = {
        "symbol": symbol,
        "latest_price": latest_data["Close"],
        "open": latest_data["Open"],
        "high": latest_data["High"],
        "low": latest_data["Low"],
        "volume": latest_data["Volume"]
    }

    # Handle different timeframes
    if timeframe == "weekly":
        response["weekly_avg"] = data["Close"].resample('W').mean().iloc[-1]
    elif timeframe == "monthly":
        response["monthly_avg"] = data["Close"].resample('M').mean().iloc[-1]

    return response


def fetch_technical_indicators(symbol: str, indicators: str = "SMA,EMA,RSI,MACD,BBANDS"):
    """Fetch technical indicators using Yahoo Finance & pandas_ta."""
    stock = yf.Ticker(symbol)
    data = stock.history(period="6mo")  # Fetch last 6 months of data

    if data.empty:
        return f"Stock symbol '{symbol}' not found."

    result = {"symbol": symbol}

    # Compute indicators based on user input
    indicator_list = indicators.split(",")

    if "SMA" in indicator_list:
        data["SMA_50"] = ta.sma(data["Close"], length=50)
        data["SMA_200"] = ta.sma(data["Close"], length=200)
        result["SMA"] = {"50-day": data["SMA_50"].iloc[-1], "200-day": data["SMA_200"].iloc[-1]}

    if "EMA" in indicator_list:
        data["EMA_50"] = ta.ema(data["Close"], length=50)
        data["EMA_200"] = ta.ema(data["Close"], length=200)
        result["EMA"] = {"50-day": data["EMA_50"].iloc[-1], "200-day": data["EMA_200"].iloc[-1]}

    if "RSI" in indicator_list:
        data["RSI"] = ta.rsi(data["Close"], length=14)
        result["RSI"] = data["RSI"].iloc[-1]

    if "MACD" in indicator_list:
        macd = ta.macd(data["Close"], fast=12, slow=26, signal=9)
        result["MACD"] = {
            "MACD": macd["MACD_12_26_9"].iloc[-1],
            "Signal": macd["MACDs_12_26_9"].iloc[-1],
            "Histogram": macd["MACDh_12_26_9"].iloc[-1],
        }

    if "BBANDS" in indicator_list:
        bbands = ta.bbands(data["Close"], length=20)
        result["Bollinger Bands"] = {
            "Upper Band": bbands["BBU_20_2.0"].iloc[-1],
            "Lower Band": bbands["BBL_20_2.0"].iloc[-1],
            "Middle Band": bbands["BBM_20_2.0"].iloc[-1],
        }

    return result


def fetch_forex_data(base_currency: str, target_currency: str, timeframe: str = "daily"):
    """Fetch real-time and historical forex exchange rates."""
    
    # Real-time exchange rate using forex-python
    currency_rates = CurrencyRates()
    try:
        real_time_rate = currency_rates.get_rate(base_currency, target_currency)
    except:
        return f"Could not fetch real-time exchange rate for {base_currency}/{target_currency}."

    # Historical data using Yahoo Finance
    forex_pair = f"{base_currency}{target_currency}=X"
    forex_data = yf.Ticker(forex_pair)

    if timeframe == "intraday":
        data = forex_data.history(period="7d", interval="1h")  # Last 7 days, hourly data
    elif timeframe == "weekly":
        data = forex_data.history(period="6mo", interval="1wk")  # Last 6 months, weekly data
    elif timeframe == "monthly":
        data = forex_data.history(period="2y", interval="1mo")  # Last 2 years, monthly data
    else:
        data = forex_data.history(period="1y", interval="1d")  # Default: Last 1 year, daily data

    if data.empty:
        return f"Could not fetch {timeframe} historical data for {base_currency}/{target_currency}."

    last_close = data["Close"].iloc[-1]
    history_summary = {
        "Real-Time Rate": real_time_rate,
        "Last Close Price": last_close,
        "Timeframe": timeframe,
        "Historical Data (last 5 records)": data["Close"].tail(5).to_dict()
    }

    return history_summary


def fetch_crypto_data(crypto_symbol: str, fiat_currency: str, timeframe: str = "daily"):
    """Fetch real-time and historical crypto price data."""

    # Format crypto ticker for Yahoo Finance (e.g., BTC-USD)
    crypto_pair = f"{crypto_symbol}-{fiat_currency}"
    crypto_data = yf.Ticker(crypto_pair)

    try:
        # Get real-time price
        real_time_price = crypto_data.history(period="1d")["Close"].iloc[-1]
    except:
        return f"Could not fetch real-time price for {crypto_symbol}/{fiat_currency}."

    # Fetch historical data based on timeframe
    if timeframe == "intraday":
        data = crypto_data.history(period="7d", interval="1h")  # Last 7 days, hourly data
    elif timeframe == "weekly":
        data = crypto_data.history(period="6mo", interval="1wk")  # Last 6 months, weekly data
    elif timeframe == "monthly":
        data = crypto_data.history(period="2y", interval="1mo")  # Last 2 years, monthly data
    else:
        data = crypto_data.history(period="1y", interval="1d")  # Default: Last 1 year, daily data

    if data.empty:
        return f"Could not fetch {timeframe} historical data for {crypto_symbol}/{fiat_currency}."

    last_close = data["Close"].iloc[-1]
    history_summary = {
        "Real-Time Price": real_time_price,
        "Last Close Price": last_close,
        "Timeframe": timeframe,
        "Historical Data (last 5 records)": data["Close"].tail(5).to_dict()
    }

    return history_summary

def fetch_fundamental_data(ticker: str, report_type: str):
    """Retrieve company financial statements from Yahoo Finance."""
    
    stock = yf.Ticker(ticker)
    
    if report_type == "INCOME_STATEMENT":
        data = stock.financials
    elif report_type == "BALANCE_SHEET":
        data = stock.balance_sheet
    elif report_type == "CASH_FLOW":
        data = stock.cashflow
    else:
        return "Invalid report type. Choose from: INCOME_STATEMENT, BALANCE_SHEET, CASH_FLOW."
    
    # Convert data to dictionary format
    if data.empty:
        return f"No data found for {ticker}."

    latest_data = data.iloc[:, :5].to_dict()  # Latest 5 columns (quarters or years)

    return {
        "Ticker": ticker,
        "Report Type": report_type,
        "Latest Data": latest_data
    }