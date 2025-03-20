import os

from dotenv import load_dotenv

  

load_dotenv()

  

class Config:

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

    VECTOR_STORE_PATH = "faiss_index"

    CHUNK_SIZE = 4000

    CHUNK_OVERLAP = 400

    MAX_TOKENS = 99999

    TEMPERATURE_ACTIVE = 0.3
    MAX_HISTORY = 6 
    MEMORY_EXPIRATION = 3600 * 24  
    TEMPERATURE_PASSIVE = 0.3

    JSON_PATHS = [
        ## the config for reading knowledge base
    r"C:\Users\gumim\Documents\lawyer-assistant-prev\LAW-Ai\fiss\backend\data.json",

    r"C:\Users\gumim\Documents\lawyer-assistant-prev\LAW-Ai\fiss\backend\dataUse.json",

    r"C:\Users\gumim\Documents\lawyer-assistant-prev\LAW-Ai\fiss\backend\dataUse1.json",

    r"C:\Users\gumim\Documents\lawyer-assistant-prev\LAW-Ai\fiss\backend\dataUse2.json",

    ]