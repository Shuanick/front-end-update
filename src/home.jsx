import {React,useState,useEffect} from "react";
import axios from "axios";
import Post from "./post.jsx";

function Home() {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //https://nickproduct-d61b16cc0f17.herokuapp.com
        const response = await axios.get("https://nickproduct-d61b16cc0f17.herokuapp.com/posts");
        console.log(response.data)
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="notlist">
      <div className="main">
        <div className="content">
          <div className="post-body">
            {posts.slice().reverse().map((post)=>(
              <Post key={post._id} post={post}/>
            ))}
          </div>
        </div>
        <div className="user"></div>
      </div>
    </div>
  );
}
export default Home;
