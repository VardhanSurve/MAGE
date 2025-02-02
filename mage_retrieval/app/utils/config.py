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
    TEMPERATURE= os.getenv("TEMPERATURE")
    INDEX_NAME=os.getenv("INDEX_NAME")
    LLM_PROVIDER=os.getenv("LLM_PROVIDER")
    LLM_MODEL_NAME=os.getenv("LLM_MODEL_NAME")
    EMBEDDING_PROVIDER=os.getenv("EMBEDDING_PROVIDER")
    EMBEDDING_MODEL_NAME=os.getenv("EMBEDDING_MODEL_NAME")
    VECTOR_STORE_NAME=os.getenv("VECTOR_STORE_NAME")
    MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")
    MONGODB_CONNECTION_STR = os.getenv("MONGODB_CONNECTION_STR")
    SESSION_ID= os.getenv("SESSION_ID")
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

    load_dotenv(dotenv_path="mage_retrieval\.env")
    env_name = os.getenv("FLASK_ENV", "development")
    return env_name


env_name = load_env_variables()
