import random
from typing import List, Dict

# Dummy responses for AI
DUMMY_RESPONSES = [
    "Hey there! How can I assist you today?",
    "I'm your friendly AI assistant. What can I do for you?",
    "Hello! I'm here to help you with any questions you might have.",
    "Hi, I'm ready to chat. What’s on your mind?",
    "Good day! How can I make your experience better today?",
    "Hello! I'm all ears. How can I assist you right now?",
    "Hi there! Need some help? I'm ready to answer your questions.",
    "Greetings! Tell me what you're looking for, and I'll help you out.",
    "Hey! I'm here to assist with anything you need.",
    "Hi! Don't hesitate to ask me anything. I'm happy to help!",
    "Welcome! How can I help you today?",
    "Hello there! Need any assistance or information?",
    "Hey, I'm here to provide any info you need. What can I do for you?",
    "Hi! Ready to answer all your burning questions. What's on your mind?",
    "Hello! Ask me anything—I'll do my best to help."
]


def get_ai_response() -> str:
    """Returns a randomly selected dummy response."""
    return random.choice(DUMMY_RESPONSES)

class ChatHistory:
    def __init__(self):
        self.history: List[Dict[str, str]] = []

    def add_message(self, user: str, message: str):
        """Add a new message to the chat history."""
        self.history.append({"user": user, "message": message})

    def get_history(self) -> List[Dict[str, str]]:
        """Retrieve the chat history as a list of dictionaries."""
        return self.history

    def add_feedback(self, index: int, feedback: bool):
        """Add boolean feedback for a specific message in the history."""
        if 0 <= index < len(self.history):
            self.history[index]["feedback"] = feedback
        else:
            raise IndexError("Message index out of range.")
