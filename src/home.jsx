import { React, useState, useEffect } from "react";
import axios from "axios";
import Post from "./post.jsx";
import { Link } from 'react-router-dom';

function Home({userId}) {
  const [posts, setPosts] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        //https://nickproduct-d61b16cc0f17.herokuapp.com
        const response = await axios.get("https://nickproduct-d61b16cc0f17.herokuapp.com/posts");
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response2 = await axios.get("https://nickproduct-d61b16cc0f17.herokuapp.com/users");
        const users = response2.data.filter(user => user.username !== userId);
        // 隨機選擇幾個用戶
        const randomUsers = [];
        const numberOfRecommendations = 5 ; // 設置推薦的數量

        while (
          randomUsers.length < numberOfRecommendations &&
          users.length > 0
        ) {
          const randomIndex = Math.floor(Math.random() * users.length);
          randomUsers.push(users[randomIndex]);
          users.splice(randomIndex, 1); // 確保不會重複選擇
        }

        setRecommendedUsers(randomUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchPosts();
    fetchUsers();
  }, [userId]);

  return (
    <div className="notlist">
      <div className="main">
        <div className="content">
          <div className="post-body">
            {posts
              .slice()
              .reverse()
              .map((post) => (
                <Post key={post._id} post={post} userId={userId}/>
              ))}
          </div>
        </div>
        <div className="user">
          <div className="recommend-title">為您推薦</div>
          <div className="recommend-users">
            {recommendedUsers.map((user) => (
                <Link key={user.username} className="link-user" to={`/users/${user.username}`}>{user.username}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
