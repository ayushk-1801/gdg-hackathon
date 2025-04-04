
# %%
from youtube_transcript_api import YouTubeTranscriptApi

ytt_api = YouTubeTranscriptApi()




# %%
def transcript_fromID(yt_id):
    fetched_transcript = ytt_api.fetch(yt_id)
    transcript = ""
    for snippet in fetched_transcript:
        transcript += snippet.text + ". "
    return transcript

# vid = "https://www.youtube.com/watch?v=8L10w1KoOU8"
# yt_id = vid.split("=")[1]


# # %%
# transccript = transcript_fromID(yt_id)
# print(transccript)

# %%
groq_api = "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"

# %%
from typing import List, Optional
from pydantic import BaseModel, Field
import os

# Define the JSON schema for each MCQ and overall output
class MCQ(BaseModel):
    question: str
    options: List[str] = Field(..., min_items=4, max_items=4)
    answer: str
    explanation: str

class TranscriptSummaryAndMCQ(BaseModel):
    summary: str
    mcqs: List[MCQ] = Field(..., min_items=5, max_items=5)

# Set up the ChatGroq LLM from langchain_groq.
# Make sure to set your GROQ API key before initializing the LLM.
os.environ["GROQ_API_KEY"] =  groq_api

from langchain_groq import ChatGroq
# Instantiate the groq LLM with a deterministic temperature and JSON response format
llm = ChatGroq(temperature=0, model_name="gemma2-9b-it", model_kwargs={"response_format": {"type": "json_object"}})


from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

# Create a PydanticOutputParser to constrain output to our TranscriptSummaryAndMCQ schema
output_parser = PydanticOutputParser(pydantic_object=TranscriptSummaryAndMCQ)

# Define a prompt template that instructs the LLM to generate a summary and 5 MCQs.
prompt_template = """\
You are provided with a transcript. Your task is to generate a JSON object that follows the schema below:

{format_instructions}

Where:
- "summary" is a detailed explanation of the concepts provided in the transcript, it can include extra information also.
- "mcqs" is a list of 5 challenging multiple-choice questions.
   Each question must have exactly 4 options, a correct answer, and an explanation.

Ensure that the output is strictly valid JSON that conforms to the schema.

Transcript:
{transcript}
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["transcript"],
    partial_variables={"format_instructions": output_parser.get_format_instructions()},
)


llm_chain = prompt | llm | output_parser



# %%
def json_from_ID (yt_id):
    fetched_transcript = ytt_api.fetch(yt_id)
    transcript = ""
    i = 0
    for snippet in fetched_transcript:
        transcript += snippet.text + ". "
        if i > 3:
            break
        i += 1
    # Call the LLM chain with the transcript

    
    result = llm_chain.invoke({"transcript": transcript})
    return result.json()

# # %%
# id = "8L10w1KoOU8"
# result = json_from_ID(id)

# %%

#fast API returns json from yt  link

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
# Allow CORS for all origins
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/transcript")
async def get_transcript(yt_link: str):
    yt_id = yt_link.split("=")[1]
    result = json_from_ID(yt_id)
    return result


import uvicorn  

if __name__ == "__main__":
    uvicorn.run(app,  host="localhost", port=8000)