# Legal Assistant

A modern, AI-powered legal assistant application built with React, TypeScript, and Tailwind CSS. This application provides an intuitive interface for legal consultations and document analysis.


![alt text](frontend/public/image.png)


## Usage
![alt text](frontend/public/Usage.gif)


## onboarding
![alt text](frontend/public/onBoarding.gif)

## PWA
![alt text](frontend/public/PWA.gif)

## Features

### Chat Interface
- **Dual Mode Support**
  - Consultation Mode: Interactive legal advice with follow-up questions
  - Research Mode: In-depth legal information and principles
- **Smart Context Management**
  - Import previous chat contexts
  - Maintain conversation history
  - Custom prompt templates

### Document Analysis
- **Document Processing**
  - Summarize legal documents
  - Compare multiple documents
  - Extract text from images (OCR)
- **File Support**
  - PDF documents
  - Text files
  - Image files

### User Experience
- **Progressive Web App (PWA)**
  - Installable on desktop and mobile
  - Offline support
  - Automatic updates
- **Responsive Design**
  - Mobile-friendly interface
  - Dark mode
  - Smooth animations

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Markdown Support**: React Markdown
- **PWA**: Vite PWA Plugin

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/lKryml/Thuraya-AI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/         # React components
│   ├── docs/          # Document analysis components
│   ├── home/          # Chat interface components
│   ├── sidebar/       # Navigation components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions
├── store/             # Zustand state management
└── main.tsx          # Application entry point
```

## Backend Architecture

The backend is built with FastAPI and integrates with Google's Gemini AI for advanced legal analysis and processing.

### Backend Stack
- **Framework**: FastAPI
- **AI Model**: Google Gemini AI
- **Vector Store**: FAISS
- **PDF Processing**: PyPDF2
- **Environment**: Python 3.9+

### Core Components

#### API Endpoints
- `/api/v1/chat`: Streaming chat responses
- `/api/v1/summarize_doc`: Document summarization
- `/api/v1/compare_docs`: Document comparison
- `/api/v1/gradio_chat`: Image-to-text processing

#### Legal Processing Engine
- Custom prompt engineering for legal context
- Vector store for efficient document retrieval
- Streaming response generation
- Chat history management
- Document processing pipeline

### Backend Structure
```
backend/
├── api/
│   └── endpoints.py    # API route handlers
├── core/
│   ├── config.py      # Configuration management
│   ├── processing.py  # Legal processing logic
│   └── prompts.py     # AI prompt templates
├── models/
│   └── schemas.py     # Pydantic models
└── main.py           # Application entry point
```

### Setup Instructions

1. **Environment Setup**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

2. **Configuration**
```bash
# Create .env file
cp .env.example .env

# Add your Google API key
GOOGLE_API_KEY=your_api_key_here
```

3. **Running the Server**
```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

### API Documentation

#### Chat Endpoint
- **POST** `/api/v1/chat`
- Handles real-time legal consultations
- Supports streaming responses
- Parameters:
  - `userPrompt`: User's legal query
  - `mode`: "active" (consultation) or "passive" (research)
  - `chatHistory`: Previous conversation context
  - `typing_speed`: Response generation speed

#### Document Processing
- **POST** `/api/v1/summarize_doc`
  - Accepts PDF documents
  - Returns structured legal summary
- **POST** `/api/v1/compare_docs`
  - Compares two legal documents
  - Highlights key differences and implications

### Development Guidelines

#### Adding New Features
1. Create endpoint in `api/endpoints.py`
2. Implement processing logic in `core/processing.py`
3. Define schemas in `models/schemas.py`
4. Update prompts in `core/prompts.py` if needed

#### Best Practices
- Use type hints for better code clarity
- Document all functions and classes
- Handle exceptions appropriately
- Use async/await for I/O operations
- Follow PEP 8 style guidelines

### Performance Considerations
- Vector store optimization for large documents
- Response streaming for better user experience
- Caching frequently accessed data
- Rate limiting for API endpoints

### Security Measures
- Input validation using Pydantic
- CORS configuration
- API key authentication
- File upload restrictions
- Error handling and logging
## Features in Detail

### Chat Modes

#### Consultation Mode
- Interactive legal consultations
- Follow-up questions for detailed understanding
- Personalized legal advice
- Evidence gathering guidance

#### Research Mode
- Legal principle explanations
- Rights and regulations information
- General legal guidance
- Reference material

### Document Tools

#### Document Summarization
- Key points extraction
- Important clause identification
- Legal terminology explanation

#### Document Comparison
- Side-by-side comparison
- Difference highlighting
- Version tracking
- Conflict identification

#### Image to Text
- OCR processing
- Text extraction from images
- Searchable document creation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

