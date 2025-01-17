from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from chatbot import get_ai_response, ChatHistory
from logging_utils import configure_logging

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up logging
logger = configure_logging()

# Instantiate the ChatHistory model for managing the chat history
chat_history = ChatHistory()

# Request model for user input
class MessageRequest(BaseModel):
    username: str
    message: str

# Request model for feedback (boolean feedback)
class FeedbackRequest(BaseModel):
    index: int
    feedback: bool 

@app.get("/")
async def get_frontend():
    return {"message": "Welcome to the Chat App!"}

@app.post("/chat/message")
async def send_message(request: MessageRequest):
    try:
        username = request.username
        user_message = request.message
        logger.info(f"Received message from user '{username}': {user_message}")

        # Add user message to chat history
        chat_history.add_message(username, user_message)

        # Generate AI response
        ai_response = get_ai_response()
        logger.info(f"Generated AI response: {ai_response}")

        # Add AI response to chat history
        chat_history.add_message("AI", ai_response)

        # Return user and AI responses
        return JSONResponse(content={
            "username": username,
            "user_message": user_message,
            "ai_response": ai_response
        })
    except Exception as e:
        logger.error(f"Error in /chat/message: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the message.")

@app.get("/chat/history")
async def get_chat_history():
    try:
        history = chat_history.get_history()
        logger.info("Chat history retrieved successfully.")
        return {"history": history}
    except Exception as e:
        logger.error(f"Error in /chat/history: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while retrieving the chat history.")

@app.post("/chat/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        index = request.index
        feedback = request.feedback  # This is a boolean feedback

        # Validate the index
        if index < 0 or index >= len(chat_history.get_history()):
            raise HTTPException(status_code=400, detail="Invalid message index.")

        # Store the boolean feedback for the message at the given index
        chat_history.add_feedback(index, feedback)
        return {"message": "Feedback submitted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while submitting the feedback.")