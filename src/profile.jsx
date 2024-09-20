import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile({userId}){
  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [originalIntroduction, setOriginalIntroduction] = useState(introduction);

  const handleEdit = () => {
    setOriginalIntroduction(introduction);
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://nickproduct-d61b16cc0f17.herokuapp.com/users/${userId}`);
        if (response.data.introduction) {
          setIntroduction(response.data.introduction); // 设置简介
        } else{
          setIntroduction("此人未留下任何內容");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

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

  return (
    <div className='notlist'>
      <div className='main'>
        <div className='profile-body'>
          <div className='profile-header'>
          <div className='profile-user'>{userId}</div>
          <div style={{ display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
            <span style={{fontWeight:'bold',margin:'0 20px 0 0'}}>個人簡介</span>
            <button style={{ fontSize: '0.8rem', padding: '0.2rem 0.4rem' }} className="btn btn-primary" onClick={handleEdit}>編輯</button>
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
              <button class="btn btn-outline-secondary" style={{marginRight:'10px'}} type="submit">更新</button>
              <button class="btn btn-outline-secondary" onClick={() => {
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
