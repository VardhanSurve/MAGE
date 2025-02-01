import logging
from enum import Enum

from langchain_experimental.text_splitter import SemanticChunker
from langchain_text_splitters import RecursiveCharacterTextSplitter


class ChunkingStrategy(Enum):
    RECURSIVE = "recursive"
    MARKDOWN = "markdown"
    SEMANTIC = "semantic"


def chunking_docs(
        strategy: ChunkingStrategy,
        documents: str,
        embedding_model=None):
    if strategy == ChunkingStrategy.RECURSIVE:
        return normal_chunking(documents)
    elif strategy == ChunkingStrategy.SEMANTIC:
        return semantic_chunking(documents, embedding_model)
    elif strategy == ChunkingStrategy.MARKDOWN:
        raise NotImplementedError("Markdown chunking is not yet implemented.")
    else:
        return semantic_chunking(documents, embedding_model)





def normal_chunking(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000, chunk_overlap=200)
    documents = text_splitter.create_documents(text)
    docs = text_splitter.split_documents(documents)
    return docs


def semantic_chunking(documents, embedding):
    semantic_splitter = SemanticChunker(
        embedding,
    )
    semantic_docs = semantic_splitter.split_documents(documents)
    return semantic_docs


async def chunking_client_docs(embedding_model, loaded_docs, source):
    logging.info("Chunking Started")
    
    chosen_strategy = "semantic"
    chunked_docs = chunking_docs(
        chosen_strategy, documents=loaded_docs, embedding_model=embedding_model
    )
    logging.info("Chunking Done")

    return chunked_docs
