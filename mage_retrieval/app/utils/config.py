import os

from dotenv import load_dotenv


class Config:
    DEBUG = False
    TESTING = False
    FILE_TYPE = os.getenv("FILE_TYPE", "pdf,image")  # pdf,image,docx



class DevelopmentConfig(Config):
    DEBUG = True
    ENV = "development"
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    AZURE_OPENAI_GPT4O_ENDPOINT = os.getenv("AZURE_OPENAI_GPT4O_ENDPOINT")
    AZURE_OPENAIAPI_GPT4O_VERSION = os.getenv("AZURE_OPENAIAPI_GPT4O_VERSION")

    AZURE_OPENAI_EMBEDDING_ENDPOINT=os.getenv("AZURE_OPENAI_EMBEDDING_ENDPOINT")
    AZURE_OPENAIAPI_EMBEDDING_VERSION=os.getenv("AZURE_OPENAIAPI_EMBEDDING_VERSION")

    AZURE_COSMOS_URI=os.getenv("AZURE_COSMOS_URI")
    AZURE_COSMOS_KEY=os.getenv("AZURE_COSMOS_KEY")

    NEO4J_URI = os.getenv("NEO4J_URI")
    NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
    NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
    SOURCE = os.getenv("SOURCE")
    SESSION_ID = os.getenv("SESSION_ID")
    TEMPERATURE= os.getenv("TEMPERATURE")
    INDEX_NAME=os.getenv("INDEX_NAME")
    LLM_PROVIDER=os.getenv("LLM_PROVIDER")
    LLM_MODEL_NAME=os.getenv("LLM_MODEL_NAME")
    EMBEDDING_PROVIDER=os.getenv("EMBEDDING_PROVIDER")
    EMBEDDING_MODEL_NAME=os.getenv("EMBEDDING_MODEL_NAME")
    VECTOR_STORE_NAME=os.getenv("VECTOR_STORE_NAME")
class ProductionConfig(Config):
    ENV = "production"


class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    ENV = "testing"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def load_env_variables():
    """Load environment variables from .env file."""

    load_dotenv(dotenv_path=".env")
    env_name = os.getenv("FLASK_ENV", "development")
    return env_name


env_name = load_env_variables()
