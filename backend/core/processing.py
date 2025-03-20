import json
import os
import re
from typing import Dict, List, Tuple, Optional, Any
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import google.generativeai as genai
from .config import Config
from .prompts import ACTIVE_PROMPT, PASSIVE_PROMPT , SUMMARY_PROMPT
from PyPDF2 import PdfReader

genai.configure(api_key=Config.GOOGLE_API_KEY)

class LegalProcessor:
    def __init__(self):
        """Initialize the LegalProcessor with embeddings and vector store."""
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        print(os.path.exists(Config.VECTOR_STORE_PATH))
        if not os.path.exists(Config.VECTOR_STORE_PATH):
            self.process_jsons()
            
        self.vector_store = FAISS.load_local(
            Config.VECTOR_STORE_PATH, 
            self.embeddings, 
            allow_dangerous_deserialization=True
        )

    def extract_content_from_json(self, data: Dict) -> List[Dict[str, Any]]:
        """
        Extract relevant content from a legal document JSON.
        
        Returns a list of document chunks with associated metadata.
        """
        documents = []
        
        # Extract metadata
        title = data.get("title", "")
        legislation_type = data.get("legislation", "")
        link = data.get("link", "")
        
        # Extract details if they exist
        if "details" in data:
            details = data["details"]
            
            # Extract metadata
            metadata = {}
            if "metadata" in details:
                metadata = details["metadata"]
            
            # Extract content
            if "content" in details:
                content_data = details["content"]
                doc_title = content_data.get("title", title)
                doc_date = content_data.get("date", "")
                
                # Process articles
                if "articles" in content_data:
                    for i, article in enumerate(content_data["articles"]):
                        article_title = article.get("title", f"مادة {i+1}")
                        article_content = article.get("content", [])
                        article_tables = article.get("tables", [])
                        
                        # Combine article content
                        article_text = f"{article_title}\n\n"
                        article_text += "\n".join(article_content)
                        
                        # Add tables if they exist
                        if article_tables:
                            article_text += "\n\nجداول:\n"
                            for table in article_tables:
                                article_text += json.dumps(table, ensure_ascii=False) + "\n"
                        
                        # Create document with metadata
                        doc_metadata = {
                            "source": title,
                            "title": doc_title,
                            "article": article_title,
                            "legislation_type": legislation_type,
                            "date": doc_date,
                            "link": link
                        }
                        # Add additional metadata
                        doc_metadata.update(metadata)
                        
                        documents.append({
                            "text": article_text,
                            "metadata": doc_metadata
                        })
                
                # Process signatory if it exists
                if "signatory" in content_data:
                    signatory = content_data["signatory"]
                    signatory_text = "توقيع:\n"
                    for key, value in signatory.items():
                        signatory_text += f"{key}: {value}\n"
                    
                    # Create document with metadata
                    doc_metadata = {
                        "source": title,
                        "title": doc_title,
                        "section": "توقيع",
                        "legislation_type": legislation_type,
                        "date": doc_date,
                        "link": link
                    }
                    # Add additional metadata
                    doc_metadata.update(metadata)
                    
                    documents.append({
                        "text": signatory_text,
                        "metadata": doc_metadata
                    })
        
        return documents

    def process_jsons(self):
        """Process JSON files and create vector store."""
        print("Processing JSON files..." , Config.JSON_PATHS)
        all_texts = []
        all_metadatas = []
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ".", " ", ""],
            length_function=len
        )
        
        for json_path in Config.JSON_PATHS:
            try:
                with open(json_path, 'r', encoding='utf-8') as file:
                    file_data = json.load(file)
                    print("hiii",file_data)
                    # Handle the "result" array structure
                    if "results" in file_data and isinstance(file_data["results"], list):
                        documents_data = file_data["results"]
                    else:
                        # Fallback to treating the entire file as a single document
                        documents_data = [file_data]
                    # Process each document in the result array
                    for data in documents_data:
                        # Extract content from the JSON
                        documents = self.extract_content_from_json(data)
                        
                        # Process each document
                        for doc in documents:
                            # Clean the text
                            text = doc["text"]
                            text = re.sub(r'\s+', ' ', text).strip()
                            
                            # Split the text into chunks
                            chunks = text_splitter.split_text(text)
                            
                            # Create metadata for each chunk
                            source_name = os.path.basename(json_path)
                            chunk_metadatas = [
                                {**doc["metadata"], "chunk_source": source_name, "chunk_index": i} 
                                for i, _ in enumerate(chunks)
                            ]
                            
                            # Extend the lists
                            all_texts.extend(chunks)
                            all_metadatas.extend(chunk_metadatas)
            except Exception as e:
                print(f"Error processing {json_path}: {e}")
        
        # Create the vector store
        if all_texts:
            vector_store = FAISS.from_texts(
                texts=all_texts,
                embedding=self.embeddings,
                metadatas=all_metadatas
            )
            
            # Save the vector store locally
            vector_store.save_local(Config.VECTOR_STORE_PATH)
            print(f"Processed {len(all_texts)} chunks from {len(Config.JSON_PATHS)} JSON files")
        else:
            print("No texts were extracted from the provided JSON files")

    def enhance_query(self, question: str) -> str:
        """Enhance the user's question for better legal context."""
        prompt = f"""
        قم بتحويل السؤال التالي إلى استعلام قانوني محترف، مع التركيز على القوانين الليبية:
        
        السؤال: {question}
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text

    def validate_question(self, question: str) -> bool:
        """Validate if the question is legally relevant."""
        prompt = f"""
        هل السؤال التالي ذو صلة قانونية بالقوانين والتشريعات الليبية؟ 
        أجب بـ"نعم" أو "لا" فقط.
        
        السؤال: {question}
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return "نعم" in response.text.strip()

    def generate_response_stream(self, question: str, mode: str, chat_history: List[Dict]):
        """Generate a streaming response using Gemini."""
        try:
            enhanced_question = self.enhance_query(question)
            
            docs = self.vector_store.similarity_search(enhanced_question, k=5)
            
            context = "\n\n".join([f"المستند: {doc.metadata.get('title', 'غير معروف')}\n{doc.page_content}" for doc in docs])
            
            formatted_history = "\n".join(
                [f"السؤال: {h['question']}\nالإجابة: {h['answer']}" 
                for h in chat_history[-Config.MAX_HISTORY*2:]]  
            )
            
            prompt_template = ACTIVE_PROMPT if mode == "active" else PASSIVE_PROMPT
            
            
            model = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                temperature=Config.TEMPERATURE_ACTIVE if mode == "active" else Config.TEMPERATURE_PASSIVE,
                streaming=True,
                max_tokens=4096
            )
            
            chain = load_qa_chain(
                model,
                chain_type="stuff",
                prompt=PromptTemplate(
                    template=prompt_template,
                    input_variables=["context", "question", "chat_history"]
                ),
                verbose=True
            )
            
            response = chain.stream({
                "input_documents": docs,
                "question": enhanced_question,
                "chat_history": formatted_history 
            })
            
            for chunk in response:
                yield chunk["output_text"]
        except Exception as e:
            print(f"Error in generate_response_stream: {str(e)}")  
            yield f"حدث خطأ في معالجة طلبك: {str(e)}"


 

    def summarize_document(self, file_path: str) -> str:
        """
        Summarize a legal document using Gemini AI.
        
        Args:
            file_path (str): Path to the document file.
        
        Returns:
            str: The summarized text.
        """
        try:
            if file_path.lower().endswith('.pdf'):
                reader = PdfReader(file_path)
                text = "\n".join([page.extract_text() for page in reader.pages])
            else:
                raise ValueError("Unsupported file type. Please upload a PDF.")
            

            
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(f"{SUMMARY_PROMPT}\n\n{text}")
            return response.text
        except Exception as e:
            return f"حدث خطأ في معالجة المستند: {str(e)}"

    def compare_documents(self, file_v1_path: str, file_v2_path: str) -> str:
        """
        Compare two versions of a legal document using Gemini AI.
        
        Args:
            file_v1_path (str): Path to the first version of the document.
            file_v2_path (str): Path to the second version of the document.
        
        Returns:
            str: The comparison result.
        """
        try:
            if file_v1_path.lower().endswith('.pdf'):
                reader_v1 = PdfReader(file_v1_path)
                text_v1 = "\n".join([page.extract_text() for page in reader_v1.pages])
            else:
                raise ValueError("Unsupported file type. Please upload a PDF.")
            
            # Validate and read second document
            if file_v2_path.lower().endswith('.pdf'):
                reader_v2 = PdfReader(file_v2_path)
                text_v2 = "\n".join([page.extract_text() for page in reader_v2.pages])
            else:
                raise ValueError("Unsupported file type. Please upload a PDF.")
            print("text_v1",text_v1)
            print("text_v2",text_v2)
            print("done reading")
            comparison_prompt = """
            You are a legal AI assistant specializing in comparing legal documents. 
            Compare the two provided versions of the document and highlight:
            
            1. **Added Clauses**: New clauses in v2 that were not in v1.
            2. **Removed Clauses**: Clauses in v1 that are missing in v2.
            3. **Modified Clauses**: Clauses with significant changes.
            4. **Legal Implications**: Analyze the impact of these changes.
            5. **Recommendations**: Provide legal advice on whether to accept the changes.

            Present the comparison in clear, professional Arabic with markdown formatting.
            """
            
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(f"{comparison_prompt}\n\nVersion 1:\n{text_v1}\n\nVersion 2:\n{text_v2}")
            print("response",response.text)
            return response.text
        except Exception as e:
            return f"حدث خطأ في مقارنة المستندات: {str(e)}"