import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from nemoguardrails import LLMRails
from pydantic import BaseModel

from agents.llm_functions import agent_hybrid_retriever
from retrievers.kg_retriever import *


# Set logging level to ERROR to suppress warnings
logging.getLogger("langchain_core").setLevel(logging.ERROR)
logging.getLogger("neo4j.notifications").setLevel(logging.ERROR)


# adding guardrails configs
guardrails_llm = LLMRails(config=guardrails_config)

# Initialize FastAPI app
app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to allow specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RetrievalRequest(BaseModel):
    query: str


# Initialize global variables
question_global = None


@app.get("/")
async def hello_world():
    return "Hello, Graph RAG llm-service with fastapi!"


@app.post("/api/question", response_class=JSONResponse)
async def ask_agentic_question(
        request: RetrievalRequest):
    data = {
        "query": request.query,
    }
    global question_global  # Declare global variables
    question_global = data["query"]
    selected_llm_model = get_llm_model(LLM_PROVIDER, LLM_MODEL_NAME, TEMPERATURE)
    ai_response = await agent_hybrid_retriever(data["query"], selected_llm_model,
                                               hybrid_kg_ensemble_retriever_with_guardrails,multimodal_retriever)
    return ai_response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="127.0.0.1", port=8000)
