from langchain_core.messages import HumanMessage

from app.agents.agent import Agent
from app.agents.tools import get_knowledge_graph_for_documents , get_multimodal_for_documents
from app.utils.config import env_name, config

session_id=config[env_name].SESSION_ID

config = {"configurable": {"thread_id": session_id}}

async def agent_hybrid_retriever(question, llm, hybrid_kg_retriever, multimodal_retriever):


    prompt_template = """You are an AI assistant that generates integrated responses using specialized tools to analyze queries efficiently while managing context length. Follow the steps below:

Process Flow:

1. Primary Tool Analysis:
   - Begin with the tool most relevant to the query (Multimodal Document Tool or Knowledge Graph Tool).  
   - Use this tool to analyze the input and generate findings.  
   - Assess the response for completeness and relevance.

2. Secondary Tool Analysis (Conditional):
   - If the initial response is incomplete or unsatisfactory:
     - Call the second tool to enhance the analysis.
     - Focus only on gaps or ambiguities identified in the primary tool’s response.

3. Integration:
   - Compare outputs from both tools (if applicable).
   - Validate for completeness and resolve inconsistencies.
   - Structure findings into key points.

4. Final Output:
   - Provide a concise, factual response based on integrated findings.
   - Attribute sources and note data limitations where necessary.

Use only the provided context. No speculation beyond available information.

**Input:** {input}  
**Retrieved Context:** {retrieved_context}  

**Answer:**
1. Findings from Primary Tool:  
{primary_tool_response}  

2. Findings from Secondary Tool (if used):  
{secondary_tool_response}  

3. Final Answer (Integrated and Validated):  
{integrated_response}
"""

    # sql_db_for_documents = get_sql_db(sql_question_retriever)
    knowledge_graph_for_documents = get_knowledge_graph_for_documents(hybrid_kg_retriever)
    multimodal_for_documents = get_multimodal_for_documents(multimodal_retriever)
    abot = Agent(llm, [knowledge_graph_for_documents,multimodal_for_documents],prompt_template)
    input_message = HumanMessage(content=question)
    result = abot.app.invoke({"messages":[input_message]},config = config)
    # return JSONResponse(content={'question': question, 'answer': result['messages'][-1].content})
    return result['messages'][-1].content

