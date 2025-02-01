import base64
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import logging
from app.providers.llm_provider import get_llm_model

def encode_image(image_path):
    """Getting the base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def image_summarize(img_base64, prompt , llm):
    """Make image summary"""
    chat = llm
    msg = chat.invoke(
        [
            HumanMessage(
                content=[
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"},
                    },
                ]
            )
        ]
    )
    return msg.content


def generate_img_summaries(path , llm):
    """
    Generate summaries and base64 encoded strings for images
    path: Path to list of .jpg files extracted by Unstructured
    """
    path = "/app/figures"
        
    # Store base64 encoded images
    img_base64_list = []

    # Store image summaries
    image_summaries = []

    # Prompt
    prompt = """
        Objective: Systematically extract key elements from visual data representations without initial analysis.
        Universal Extraction Guidelines:

        Titles: Capture verbatim, maintaining original formatting
        Headers/Labels: Extract completely, including units/symbols
        Core Elements: List all primary components without filtering
        Contextual Details: Note special features, annotations, formatting

        Table Extraction:

        Title: Verbatim capture
        Column Headers: Full extraction (multi-level, units inclusive)
        Column Elements:

        First column: Complete listing
        Supplementary columns: Contextual details


        Special Notations: Highlight unique structural elements

        Graph Extraction:

        Title: Verbatim description
        Axes:

        Labels (including units)
        Multiple axes if present


        Legend: Complete series details
        Data Points: Key coordinate/marker values
        Contextual Annotations: Significant trend indicators

        Other Visual Data:

        Title/Description: Verbatim capture
        Key Components: Comprehensive listing
        Semantic Elements:

        Symbols
        Color codes
        Meaningful annotations


        Contextual Markers: Process/relational indicators

        Standardized Output Structure:

        [Data Type]: 
        - Title: [Exact Title]
        - Headers: [Comprehensive List]
        - Primary Elements: [Detailed Extraction]
        - Contextual Notes: [Significant Observations]
    """
    table_chunks=[]
    # Apply to images
    for img_file in sorted(os.listdir(path)):
        flag_table = False
        if img_file.endswith(".jpg"):
            if img_file.startswith("table"):
                flag_table=True
                    
            img_path = os.path.join(path, img_file)
            base64_image = encode_image(img_path)
            img_base64_list.append(base64_image)
            summary = image_summarize(base64_image, prompt, llm)
            image_summaries.append(summary)
            if flag_table:
                table_chunks.append(summary)
                
    logging.info(len(img_base64_list))
    return img_base64_list, image_summaries , table_chunks