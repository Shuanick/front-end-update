import { React, useState } from "react";
import { RiHeartFill } from "react-icons/ri";

function Post({ post }) {
  const [isLike, setIsLike] = useState(false);
  let toggleLike = ()=>{
    setIsLike(!isLike);
  }
  return (
    <div className="post" key={post._id}>
      <div className="post-id">{post.user}</div>
      <div className="post-image-body">
        <img src={post.image} className="post-image" />
      </div>
      <div className="post-icons">
        {isLike?<RiHeartFill className="post-icon like" onClick={toggleLike}/> : <RiHeartFill className="post-icon unlike" onClick={toggleLike}/>}
      </div>
      <div className="post-text">{post.content}</div>
    </div>
  );
}

export default Post;
