
# Chat Application

This repository contains a full-stack chat application with a **FastAPI backend** and a **React frontend**. The backend handles chat interactions, and the frontend communicates with the backend via API requests. The project is containerized with Docker for easy deployment.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [API Contract](#api-contract)
- [How to Run the Backend](#how-to-run-the-backend)
- [How to Run the Frontend](#how-to-run-the-frontend)
- [Running Both Together](#running-both-together)
- [Generative AI/LLM Integration Details](#generative-AI/LLM-integration-details)

---

## Project Overview

- **Backend**: FastAPI application that provides API endpoints for sending and receiving chat messages.
- **Frontend**: React application (Vite setup) that allows users to interact with the chat system.

---

## Technologies Used

- **FastAPI**: Backend framework to build the REST API.
- **Python 3.9**: Programming language for backend logic.
- **Docker**: Containerization for the backend.
- **React**: Frontend framework for building the user interface.
- **Vite**: Build tool for faster development in React.
- **Flake8**: Linting for Python code quality.
- **Pytest**: Testing framework for unit testing.

---

## API Contract

### 1. **POST** `/send_message`
- **Description**: Accepts a user message, sends it to a simulated AI assistant, and returns the user message along with the AI's response.
- **Request Body**:

```json
{
  "username": "string",
  "message": "string"
}
```

- **Example Request**:

```json
{
  "username": "Alice",
  "message": "Hello, AI!"
}
```

- **Response Body** (200 OK):

```json
{
  "username": "Alice",
  "user_message": "Hello, AI!",
  "ai_response": "Hi there! I'm a simulated AI assistant."
}
```

- **Error Response** (500 Internal Server Error):

```json
{
  "detail": "An error occurred while processing the message."
}
```

---

### 2. **GET** `/chat/history`
- **Description**: Retrieves the full chat history, including user and AI messages.
- **Response Body** (200 OK):

```json
{
  "history": [
    {
      "user": "Alice",
      "message": "Hello, AI!"
    },
    {
      "user": "AI",
      "message": "Hi there! I'm a simulated AI assistant."
    }
  ]
}
```

- **Error Response** (500 Internal Server Error):

```json
{
  "detail": "An error occurred while retrieving the chat history."
}
```

---

### 3. **POST /chat/feedback**
This endpoint allows users to submit feedback for a specific message in the chat history. The feedback is boolean (true for positive feedback, false for negative feedback).

- **HTTP Method**: POST
- **Request Body (JSON)**:
    ```json
    {
      "index": 1,
      "feedback": true
    }
    ```

- **Response**:
    - **Success (200)**:
        ```json
        {
          "message": "Feedback submitted successfully."
        }
        ```
    - **Error (400 - Invalid index)**:
        ```json
        {
          "detail": "Invalid message index."
        }
        ```
    - **Error (500 - Server error)**:
        ```json
        {
          "detail": "An error occurred while submitting the feedback."
        }
        ```

---

## How to Run the Backend

### Prerequisites
- Docker Desktop (running)
- Python 3.9 or higher (optional, if not using Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

### Step 2: Run the Backend using Docker (Recommended)

If you're using Docker, you can easily build and run the backend container.

1. **Make sure Docker Desktop is running.**

2. **Build the Docker image**:

   ```bash
   docker build -t chat-app .
   ```

3. **Run the container**:

   ```bash
   docker run -p 8000:8000 chat-app
   ```

The backend will be running on [http://localhost:8000](http://localhost:8000).

### Step 3: Run the Backend without Docker

If you don't want to use Docker, you can run the backend directly:

1. **Set up a virtual environment**:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI app**:

   ```bash
   uvicorn app:app --reload
   ```

This will start the backend server locally on [http://localhost:8000](http://localhost:8000).

---

## How to Run the Frontend

### Prerequisites
- Node.js (v18 or higher recommended)

### Step 1: Clone the Frontend Repository

```bash
git clone https://github.com/yourusername/chat-app-react.git
cd chat-app-react
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the React Application

```bash
npm run dev
```

The React frontend will be running on [http://localhost:5173](http://localhost:5173).

---

## Running Both Together

1. **Run the Backend** (follow the steps above under [How to Run the Backend](#how-to-run-the-backend)).
2. **Run the Frontend** (follow the steps above under [How to Run the Frontend](#how-to-run-the-frontend)).

Now you should be able to open [http://localhost:5173](http://localhost:5173) in your browser and interact with the chat application, which communicates with the backend running on [http://localhost:8000](http://localhost:8000).

---

## Generative AI/LLM Integration Details

In a real-world production environment, the `get_ai_response` function (which currently returns dummy responses) would be replaced by an actual call to a generative AI model or API. Here's how we could replace it:

1. **Replacing with a Local Model**:
    - If we have access to a pre-trained AI model, we can load it into the backend system to generate responses based on the user’s message. This could involve using libraries such as **TensorFlow**, **PyTorch**, or **Hugging Face’s Transformers** for text generation.
    - The model can be fine-tuned with specific data to improve responses.
    - The model would take the user's input message as input and return the generated response.

    Example:
    ```python
    from transformers import GPT2LMHeadModel, GPT2Tokenizer

    model = GPT2LMHeadModel.from_pretrained("gpt2")
    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

    def get_ai_response(user_message: str) -> str:
        inputs = tokenizer.encode(user_message, return_tensors="pt")
        response = model.generate(inputs, max_length=100, num_return_sequences=1)
        return tokenizer.decode(response[0], skip_special_tokens=True)
    ```

2. **Using an External AI API**:
    - Another option is to integrate with an external AI service, such as OpenAI's GPT-3, Google Dialogflow, or similar APIs, which handle the text generation.
    - To replace the dummy function, we'd send the user message to the API and return the response from the AI model.

    Example using OpenAI's GPT-3:
    ```python
    import openai

    openai.api_key = 'your-api-key'

    def get_ai_response(user_message: str) -> str:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=user_message,
            max_tokens=100
        )
        return response.choices[0].text.strip()
    ```

3. **Handling User Feedback**:
    - After integrating the real AI, we can collect user feedback on the responses to help refine the system. This feedback can be used to retrain the model or fine-tune the API responses for better results in future interactions.

4. **Error Handling and Failover**:
    - In production, we need to account for errors such as API downtime or slow response times. If an external API fails, we can have fallback responses or retry mechanisms to ensure a smooth user experience.
    - Additionally, we should have mechanisms to handle any errors from the model (e.g., timeouts, invalid inputs).

By using real models or APIs, the chatbot's responses can become more intelligent and personalized, improving the overall user experience.
