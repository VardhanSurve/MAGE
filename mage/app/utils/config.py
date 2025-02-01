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
    MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE")
    MONGODB_CONNECTION_STR = os.getenv("MONGODB_CONNECTION_STR")
    AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_BUCKET_NAME=os.getenv("AWS_BUCKET_NAME")
    AWS_REGION=os.getenv("AWS_REGION")
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


def reload_config():
    global config
    config = config = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig,
    }


def load_env_variables():
    load_dotenv(dotenv_path=".env", verbose=True, override=True)
    env_name = os.getenv("FLASK_ENV", "development")
    return env_name
