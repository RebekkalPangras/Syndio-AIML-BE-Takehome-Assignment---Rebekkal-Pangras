import { Alert, Avatar, IconButton, OutlinedInput, TextField } from '@mui/material'
import styles from './Chatbot.module.css'
import * as react from 'react'
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { deepPurple } from '@mui/material/colors';
import LogoutIcon from '@mui/icons-material/Logout';
import Face2Icon from '@mui/icons-material/Face2';
import DownloadIcon from '@mui/icons-material/Download';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from "axios";
import _ from "lodash"

export const Chat = () => {
  const [username, setUsername] = useState("User");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: 'Hello, How can I help you?', sender: 'bot' }
  ]);
  const divRef = react.useRef(null);

  react.useEffect(() => {
    // Scroll the div to the bottom whenever the messages change
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage()
    }
  };
  // Handle form submit to send message
  const handleSendMessage = async (e) => {
    // e.preventDefault();
    if (!username || !message) {
      alert("Please enter both username and message");
      return;
    }

    try {
      // Send message via API call to backend
      const response = await axios.post("http://localhost:8000/chat/message", {
        username: username,
        message: message,
      });

      // Add the response to the messages state
      let tempResp = [{ text: response.data.user_message, sender: "user" }, { text: response.data.ai_response, sender: "bot" }]
      setMessages([...messages, ...tempResp]);
      setMessage(""); // Clear message input
    } catch (error) {
      console.error("Error sending message", error);
    }

  };


  const handleDownloadHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/chat/history");
      const history = response.data;

      // Convert JSON to string and create a Blob
      const fileContent = JSON.stringify(history, null, 2); // Prettify JSON
      const blob = new Blob([fileContent], { type: "text/plain" });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "chat_history.txt";
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading chat history:", error);
    }
  };

  // Function to send feedback
  const submitFeedback = async (index, feedback) => {
    const url = 'http://localhost:8000/chat/feedback';
    const body = {
      index: index - 1,
      feedback: feedback
    }

    try {
      const response = await axios.post(url, body)

      if (response.status == 200) {
        console.log('Feedback submitted successfully');
        let tempMsgs = _.cloneDeep(messages)
        tempMsgs[index].feedback = feedback
        setMessages(tempMsgs)
      } else {
        const errorData = await response;
        console.error('Error submitting feedback:', errorData);
        throw new Error(errorData.data || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const stringAvatar = (name) => {
    if (name === 'bot') {
      return {
        children: "AI",
      };
    }
    else {
      return {
        children: `${name[0]}`.toUpperCase(),
      };
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.leftPanel}>
        <div className={styles.userDetails}>
          <Face2Icon sx={{ width: "56px", height: "56px", margin: "0px 20px" }} />
          <div>Hi, {username}</div>
        </div>
        <div className={styles.options} onClick={handleDownloadHistory}>
          <DownloadIcon sx={{ margin: "0px 20px" }} />
          <div>Chat History</div>
        </div>
        <div className={styles.options}>
          <LogoutIcon sx={{ margin: "0px 20px" }} />
          <div>Logout</div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.header}>
          Ask your query
        </div>

        <div className={styles.chatContainer}>
          <div ref={divRef} className={styles.messages}>
            {messages.map((message, index) => (
              <>
                <div key={index} className={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
                  <div style={{ margin: "0px 8px" }}><Avatar {...stringAvatar(message.sender)} sx={message.sender === 'user' ? { width: 56, height: 56 } : { width: 56, height: 56, bgcolor: deepPurple[500] }} /></div>
                  <div className={message.sender === 'user' ? styles.userText : styles.botText}>
                    {message.text}
                    {index != 0 && message.sender === 'bot' && ![true, false].includes(message.feedback) ?
                      <div className={styles.actions}>
                        <ThumbUpIcon sx={{ color: "#000000", marginRight: "8px", cursor: "pointer" }} onClick={() => submitFeedback(index, true)} />
                        <ThumbDownIcon sx={{ color: "#000000", cursor: "pointer" }} onClick={() => submitFeedback(index, false)} />
                      </div>
                      : message.sender === 'bot' && message.feedback === true ?
                        <div className={styles.actions}><ThumbUpIcon sx={{ color: "#000000", marginRight: "8px" }} /></div>
                        : message.sender === 'bot' && message.feedback === false ?
                          <div className={styles.actions}><ThumbDownIcon sx={{ color: "#000000" }} /></div>
                          : ""
                    }
                  </div>
                </div>

              </>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <OutlinedInput
              variant="outlined"
              endAdornment={
                <IconButton size='large' sx={{ color: "#673ab7" }} onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              }
              onKeyDown={handleKeyDown}
              sx={{ borderRadius: 25 }}
              fullWidth
              value={message}
              onChange={handleMessageChange}
              placeholder="Start typing..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
