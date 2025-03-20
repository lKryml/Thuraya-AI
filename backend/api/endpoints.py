from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from core.processing import LegalProcessor
from models.schemas import ChatRequest
import asyncio
import os
import tempfile
from PyPDF2 import PdfReader

router = APIRouter()
processor = LegalProcessor()

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        formatted_history = []
        if request.chatHistory:
            for i in range(0, len(request.chatHistory) - 1, 2):
                if request.chatHistory[i]["isUser"] and not request.chatHistory[i+1]["isUser"]:
                    formatted_history.append({
                        "question": request.chatHistory[i]["content"],
                        "answer": request.chatHistory[i+1]["content"]
                    })
        print(formatted_history)
        async def generate():
            full_response = []
            typing_speed = request.typing_speed or 0.03
            word_pause = request.word_pause or 0.08
            
            typing_speed = max(0.01, min(typing_speed, 0.5)) 
            word_pause = max(0.01, min(word_pause, 0.5))

            for text_chunk in processor.generate_response_stream(
                question=request.userPrompt,
                mode=request.mode,
                chat_history=formatted_history  
            ):
                for char in text_chunk:
                    full_response.append(char)
                    yield char
                    await asyncio.sleep(typing_speed)
                await asyncio.sleep(word_pause)

        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 

@router.post("/summarize_doc")
async def summarize_document(file: UploadFile = File(...)):
    """
    Summarize legal documents for lawyers, focusing on key legal clauses and obligations.
    """
    try:
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        print("Summarizing document..." + temp_path)
        summary = processor.summarize_document(temp_path)
        print(summary)
        os.remove(temp_path)
        
        return {"summary": summary}
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/compare_docs")
async def compare_documents(
    file_v1: UploadFile = File(...),
    file_v2: UploadFile = File(...)
):
    """
    Compare two versions of a legal document and highlight changes.
    """
    temp_path_v1 = None
    temp_path_v2 = None
    try:
        for file in [file_v1, file_v2]:
            if not file.filename or not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400,
                                  detail="Both files must be PDF documents.")

        temp_path_v1 = f"temp_{file_v1.filename}"
        temp_path_v2 = f"temp_{file_v2.filename}"

        with open(temp_path_v1, "wb") as buffer:
            buffer.write(await file_v1.read())
        with open(temp_path_v2, "wb") as buffer:
            buffer.write(await file_v2.read())

        print("Comparing documents..." + temp_path_v1 + temp_path_v2)
        comparison_result = processor.compare_documents(temp_path_v1, temp_path_v2)
      
        return {"comparison": comparison_result}

    except Exception as e:       
        raise HTTPException(status_code=500, detail=str(e))

