from pydantic import BaseModel
from typing import List, Optional, Dict


class ChatRequest(BaseModel):
    userPrompt: str
    mode: str = "default"
    typing_speed: float = 0.03
    word_pause: float = 0.08
    image_url: Optional[str] = None 
    chatHistory: Optional[List[Dict]] = None 
    
class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    status: str = "success"