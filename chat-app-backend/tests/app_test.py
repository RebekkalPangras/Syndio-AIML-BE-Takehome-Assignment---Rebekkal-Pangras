from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_send_message():
    response = client.post("/chat/message", json={"username": "Alice", "message": "Hello!"})
    assert response.status_code == 200
    assert "user_message" in response.json()
    assert "ai_response" in response.json()

def test_get_chat_history():
    response = client.get("/chat/history")
    assert response.status_code == 200
    assert "history" in response.json()
