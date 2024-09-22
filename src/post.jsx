import { React, useState,useEffect } from "react";
import { RiHeartFill } from "react-icons/ri";
import axios from "axios";


function Post({ post,userId }) {
  const [likedBy, setLikedBy] = useState([]);
  useEffect(() => {
    // 初始時從伺服器獲取按讚用戶 ID
    setLikedBy(post.likedBy || []);

  }, [post]);

  const isLiked = likedBy.includes(userId);
  const toggleLike = async ()=>{
    try {
      if (isLiked) {
        // 取消讚
        const updatedLikedBy = likedBy.filter(username => username !== userId);
        setLikedBy(updatedLikedBy);
        await axios.patch(`https://nickproduct-d61b16cc0f17.herokuapp.com/posts/${post._id}`, { likedBy: updatedLikedBy });
      } else {
        // 新增讚
        const updatedLikedBy = [...likedBy, userId];
        setLikedBy(updatedLikedBy);
        await axios.patch(`https://nickproduct-d61b16cc0f17.herokuapp.com/posts/${post._id}`, { likedBy: updatedLikedBy });
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  }
  const utcDate = new Date(post.createdAt);
  const taiwanTime = utcDate.toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei",month: '2-digit', day: '2-digit' });
  return (
    <div className="post" key={post._id}>
      <div className="post-head">
        <div className="post-id">{post.user}</div>
        <div className="post-time">{`• ${taiwanTime}`}</div>
      </div>
      <div className="post-image-body">
        <img src={post.image} className="post-image" />
      </div>
      <div className="post-icons">
        {<RiHeartFill className={`post-icon ${isLiked?"like":"unlike"}`} onClick={toggleLike}/>}
        <div className="likes-number">{likedBy.length===0?"此貼文尚未被按讚":likedBy.length+"個人按讚"}</div>
      </div>
      <div className="post-text">{post.content}</div>
    </div>
  );
}

export default Post;
