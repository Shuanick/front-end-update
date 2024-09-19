import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile(){
  const { userId } = useParams(); // 確保從路由中獲取 userId
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}`);
        console.log(response.data);
        setUser(response.data.user);
        // setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <div>
      
    </div>
  );
};

export default Profile;
