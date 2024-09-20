import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://nickproduct-d61b16cc0f17.herokuapp.com/users/register",
        { username, password }
      );
      alert("注册成功");
      navigate("/");
    } catch (error) {
      alert("注册失败:" + error.message);
    }
  };

  return (
    <div className="login-page">
      {/* <form className="login-body" onSubmit={handleSubmit}>
        <div className="login-head">註冊您的帳號</div>
        <div>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">注册</button>
      </form> */}
    </div>
  );
}

export default Register;
