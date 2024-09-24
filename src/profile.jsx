import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile(){
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [originalIntroduction, setOriginalIntroduction] = useState(introduction);
  const [isRequest, setIsRequest] = useState(false);
  const [currentId, setCurrentId] = useState(localStorage.getItem("userId"));

  const handleEdit = () => {
    setOriginalIntroduction(introduction);
    setIsEditing(true);
  };

  useEffect(() => {
    console.log("currentId :"+currentId);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}`);
        if (response.data.introduction) {
          setIntroduction(response.data.introduction); // 设置简介
        } else{
          setIntroduction("此人未留下任何內容");
        }
        const friendRequests = response.data.friendRequests || [];
        setIsRequest(friendRequests.includes(currentId));

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId,currentId]);

  const updateIntroduction = async () => {
    try {
        const response = await axios.patch(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}`, {
        introduction,
      });
      console.log('Updated User:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleClick = async () => {
    try {
      if (isRequest) {
        // 撤销好友请求
        await axios.delete(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}/friend-request`, {
          data: { requesterUsername: currentId }
        });

        setIsRequest(false);
      } else {
        //發送好友请求
        await axios.post(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}/friend-request`, {
          requesterUsername: currentId
        });
        //發送通知
        await axios.post(`https://nickproduct-d61b16cc0f17.herokuapp.com/notifications`, {
          user: userId, // 接收通知的用户
          type: "friendRequest", // 通知类型
          from: currentId // 发送请求的用户
        });

        setIsRequest(true);
      }
    } catch (error) {
      console.error("Error toggling friend request:", error);
    }
  };

  return (
    <div className='notlist'>
      <div className='main'>
        <div className='profile-body'>
          <div className='profile-header'>
            <div className='user-friend'>
              <div className='profile-user'>{userId}</div>
              {currentId===userId?"":<button onClick={handleClick} className={`addfriend ${isRequest?"request":"not-request"}`}>{isRequest?"已申請":"新增好友"}</button>}
            </div>
            <div className='fans'></div>
            <div style={{ display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
              <span style={{fontWeight:'bold',margin:'0 20px 0 0'}}>個人簡介</span>
              {currentId===userId?<button style={{ fontSize: '0.8rem', padding: '0.2rem 0.4rem' }} className="btn btn-primary" onClick={handleEdit}>編輯</button>:""}
            </div>
            {isEditing?(
              <form className='profile-intrducction-body' onSubmit={(e) => {
                e.preventDefault();
                updateIntroduction();
              }}>
                <textarea
                  className='profile-introduction'
                  type='text'
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                />           
                <button className="btn btn-outline-secondary" style={{marginRight:'10px'}} type="submit">更新</button>
                <button className="btn btn-outline-secondary" onClick={() => {
                  setIntroduction(originalIntroduction);
                  setIsEditing(false);
                }}>取消</button>
              </form>    
            ):(
              <div className='profile-intrducction-body'>
                <div className='profile-introduction'>{introduction}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
