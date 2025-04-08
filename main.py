from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import json
import re
import pymongo
from bson import ObjectId
from config import ConfigData
import os

# Custom JSON encoder for MongoDB documents
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

def create_llm():
    """Initialize the ChatOpenAI model"""
    return ChatOpenAI(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        model='gpt-4o-mini'
    )

def create_prompt_template():
    """Create the prompt template for query generation"""
    template = """
    You are an expert in crafting NoSQL queries for MongoDB with 10 years of experience, particularly in MongoDB. 
    I will provide you with the table_schema and schema_description in a specified format. 
    Your task is to read the user_question, which will adhere to certain guidelines or formats, and response based on few shot examples.
    Note: You have to list the properties which comes under the budget of the user.
    
    Table schema:{table_schema}
    Schema Description: {schema_description}

    Here are some example:
    Input: I am looking for one time investment property with budget 1000000000
    Output: {json_ex_string_1} 

    Input: I am looking for montly payment property with budget 1200000
    Output: {json_ex_string_2} 

    Note: if user is looking for one time investment property, then use json_ex_string_1 and if user is looking for montly payment property, then use json_ex_string_2
    Input: {user_question}
    """
    
    return PromptTemplate(
        template=template,
        input_variables=["user_question", "json_ex_string_1", "json_ex_string_2", "table_schema", "schema_description"]
    )

def get_query(llmchain, user_question, json_ex_string_1, json_ex_string_2):
    """Generate response based on user question"""
    response = llmchain.invoke({
        "user_question": user_question,
        "json_ex_string_1": json_ex_string_1,
        "json_ex_string_2": json_ex_string_2,
        "table_schema": ConfigData.TABLE_SCHEMA,
        "schema_description": ConfigData.SCHEMA_DESCRIPTION
    })

    response_text = response['text'].replace("Output: ", "")
    # Clean up the response to get just the JSON array
    output_string = response_text.strip()
    if output_string.startswith('[') and output_string.endswith(']'):
        return json.loads(output_string)
    else:
        raise ValueError("Invalid response format from LLM")

def setup_mongodb():
    """Setup MongoDB connection"""
    client = pymongo.MongoClient(ConfigData.MONGO_DB_URI)
    db = client[ConfigData.DB_NAME]
    return db[ConfigData.COLLECTION_NAME]

def main():
    # Initialize components
    llm = create_llm()
    prompt = create_prompt_template()
    llmchain = LLMChain(llm=llm, prompt=prompt, verbose=True)
    collection = setup_mongodb()

    # Load example data
    json_ex_1 = ConfigData.FEW_SHOT_EXAMPLE_1
    json_ex_string_1 = json.dumps(json_ex_1)
    json_ex_2 = ConfigData.FEW_SHOT_EXAMPLE_2
    json_ex_string_2 = json.dumps(json_ex_2)

    # Example query
    user_question = "I am looking for monthly payment property with budget 120000"
    # user_question = "I am looking for one time investment property with budget 100000000"
    try:
        query = get_query(llmchain, user_question, json_ex_string_1, json_ex_string_2)
        # print("Generated query:", json.dumps(query, indent=2))
        
        # Execute query
        result = collection.aggregate(query)
        found_results = False
        for doc in result:
            found_results = True
            # Use custom JSON encoder to handle ObjectId
            print(json.dumps(doc, indent=2, cls=JSONEncoder))
        
        if not found_results:
            print("No properties found matching your criteria")
            
    except Exception as e:
        print(f"Error executing query: {str(e)}")

if __name__ == "__main__":
    main() 