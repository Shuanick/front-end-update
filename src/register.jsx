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
      alert("註冊成功");
      navigate("/");
    } catch (error) {
      alert("註冊失敗:" + error.message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-body" onSubmit={handleSubmit}>
        <div className="login-head">註冊您的帳號</div>
        <div>
          <input
            type="text"
            placeholder="帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
            required
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
        </div>
        <button type="submit">注册</button>
      </form>
    </div>
  );
}

export default Register;
