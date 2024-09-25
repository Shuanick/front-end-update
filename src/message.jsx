import { React, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Message({socket}) {
  const currentId = localStorage.getItem("userId");
  const location = useLocation();
  const { talkId } = location.state || { talkId: null };
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(talkId);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);

  const messageContainerRef = useRef(null);

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `https://nickproduct-d61b16cc0f17.herokuapp.com/chats/${currentId}`
      );
      const chats = response.data;
      const chat = chats.find((chat) =>
        chat.participants.includes(selectedFriend)
      );
      setMessages(chat ? chat.messages : []); // 更新消息状态
    } catch (error) {
      console.error("获取聊天记录时出错:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      //獲取當前用戶的聊天紀錄
      const response = await axios.get(
        `https://nickproduct-d61b16cc0f17.herokuapp.com/chats/${currentId}`
      );
      const chats = response.data;

      const participantsMap = new Map();

      // 提取聊天对象，假设聊天记录中有 participants
      chats.forEach((chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        chat.participants.forEach((participant) => {
          if (participant !== currentId) {
            participantsMap.set(
              participant,
              lastMessage ? lastMessage.timestamp : new Date(0)
            );
          }
        });
      });

      // 将参与者转换为数组并排序
      const sortedFriends = Array.from(participantsMap.entries()).sort(
        (a, b) => new Date(b[1]) - new Date(a[1])
      ); // 按时间戳降序排序
      setFriends(sortedFriends.map(([friend]) => friend)); // 只保留朋友的ID
    } catch (error) {
      console.error("获取朋友时出错:", error);
    }
  };

  useEffect(() => {
    // 当 messages 更新时，滚动到最底部
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchFriends();
    fetchMessage();
  }, [talkId, selectedFriend]);

  useEffect(() => {
    if(socket){
      socket.onmessage = (event) => {     
        fetchFriends();   
        let newMessage = JSON.parse(event.data);
        console.log(newMessage.chat.messages);
        setMessages((prevMessages) => {
          if (!prevMessages.find(msg => msg._id === newMessage.chat.messages._id)) {
            return [...prevMessages, newMessage.chat.messages].flat();
          }
          return prevMessages;
        });
      };   
    }
  },[socket]);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault(); // 防止页面刷新
    if (messageContent.trim() === "") return; // 确保内容不为空

    const messageData = {
      sender: currentId,
      reciever: selectedFriend,
      content: messageContent,
      participants: [currentId, selectedFriend],
    };

    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessageContent(""); // 清空输入框

    try {
      await axios.post(
        "https://nickproduct-d61b16cc0f17.herokuapp.com/chats",
        messageData
      );

      setFriends((prevFriends) => {
        const updatedFriends = prevFriends.filter(
          (friend) => friend !== selectedFriend
        );
        updatedFriends.unshift(selectedFriend); // 放到最前面
        return updatedFriends;
      });
    } catch (error) {
      console.error("发送消息时出错:", error);
    }
  };

  return (
    <div className="notlist">
      <div className="message-list">
        <div
          style={{
            width: "100%",
            height: "120px",
            display: "flex",
            alignItems: "center",
            fontSize: "30px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            paddingLeft: "20px",
          }}
        >
          {currentId}
        </div>
        <div
          style={{
            fontWeight: "bold",
            fontFamily: "sans-serif",
            fontSize: "20px",
            margin: "20px",
          }}
        >
          訊息
        </div>
        <div className="friends">
          {friends.map((friend) => (
            <div
              key={friend}
              onClick={() => handleFriendClick(friend)}
              className="talk-box"
            >
              {friend}
            </div>
          ))}
        </div>
      </div>
      <div className="messagebox">
        {selectedFriend ? (
          <>
            <div className="friend-user">{selectedFriend}</div>
            <div className="message" ref={messageContainerRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.sender === selectedFriend
                      ? "other-message"
                      : "my-message"
                  }
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="message-content-box">
              <input
                type="text"
                className="message-content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="请输入消息..."
              />
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
}
export default Message;
