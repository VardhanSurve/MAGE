from langchain.agents import AgentExecutor
from langchain.agents import create_tool_calling_agent
from langchain.tools.base import StructuredTool
from langchain.tools.retriever import create_retriever_tool
from langchain_core.pydantic_v1 import BaseModel, Field
from langsmith import traceable
from agents.tool_helpers import *


@traceable
def get_retriever_tool(retriever):
    retriever_tool = create_retriever_tool(
        retriever,
        "document_search",
        (
            "Retrieve relevant contract information. Use this tool only once per question, "
            "unless instructed otherwise."
        ),
    )
    return retriever_tool


@traceable
def get_knowledge_graph_for_documents(hybrid_ensemble_retriever):
    return StructuredTool(
        args_schema=ArgsSchema,
        func=hybrid_ensemble_retriever,
        name="knowledge_graph_for_documents",
        description="Use this tool to extract information from documents which are embedded in the knowledge graph as well as vector database.",
    )

@traceable
def get_multimodal_for_documents(multimodal_retriever):
    return StructuredTool(
        args_schema=ArgsSchema,
        func=multimodal_retriever,
        name="multimodal_for_documents",
        description="Use this tool to extract information from documents which are embedded in the knowledge graph as well as vector database.",
    )


@traceable
def get_stock_price_agent():
    return StructuredTool(
        args_schema=StockQuerySchema,
        func=fetch_stock_price,
        name="stock_price_agent",
        description="Fetches real-time and historical stock prices for a given symbol."
    )
    
@traceable
def get_forex_agent():
    return StructuredTool(
        args_schema=ForexQuerySchema,
        func=fetch_forex_data,
        name="forex_trading_agent",
        description="Retrieves real-time and historical exchange rates for currency pairs."
    )
    
@traceable    
def get_crypto_agent():
    return StructuredTool(
        args_schema=CryptoQuerySchema,
        func=fetch_crypto_data,
        name="crypto_market_agent",
        description="Tracks cryptocurrency price movements and trends in real-time and historically."
    )

@traceable
def get_fundamental_agent():
    return StructuredTool(
        args_schema=FundamentalQuerySchema,
        func=fetch_fundamental_data,
        name="fundamental_data_agent",
        description="Fetches company financial statements such as Income Statement, Balance Sheet, and Cash Flow."
    )

    
    
    
def create_agent_executor(llm, tools, prompt):
    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
    return agent_executor
    
################################# Here Lie The Input Model Args ########################
class ArgsSchema(BaseModel):
    question: str = Field()

    
class StockQuerySchema(BaseModel):
    symbol: str = Field(description="Stock symbol (e.g., AAPL, TSLA, GOOG)")
    timeframe: str = Field(
        description="Timeframe for stock data (daily, weekly, monthly). Default is 'daily'.",
        default="daily"
    )
    
class TAQuerySchema(BaseModel):
    symbol: str = Field(description="Stock symbol (e.g., AAPL, TSLA, GOOG)")
    indicators: str = Field(
        description="Comma-separated list of technical indicators (SMA, EMA, RSI, MACD, BBANDS). Default is all.",
        default="SMA,EMA,RSI,MACD,BBANDS"
    )    
    
class ForexQuerySchema(BaseModel):
    base_currency: str = Field(description="Base currency (e.g., USD, EUR, GBP)")
    target_currency: str = Field(description="Target currency (e.g., JPY, INR, CAD)")
    timeframe: str = Field(
        description="Timeframe for historical data (intraday, daily, weekly, monthly). Default is 'daily'.",
        default="daily"
    )    
    
class CryptoQuerySchema(BaseModel):
    crypto_symbol: str = Field(description="Cryptocurrency symbol (e.g., BTC, ETH, SOL)")
    fiat_currency: str = Field(description="Fiat currency (e.g., USD, EUR, USDT)")
    timeframe: str = Field(
        description="Timeframe for historical data (intraday, daily, weekly, monthly). Default is 'daily'.",
        default="daily"
    )
    
class FundamentalQuerySchema(BaseModel):
    ticker: str = Field(
        description="Stock ticker symbol (e.g., 'AAPL' for Apple, 'TSLA' for Tesla)."
    )
    report_type: str = Field(
        description="Type of fundamental data. Options: 'INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW'."
    )
