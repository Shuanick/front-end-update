import React, { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://nickproduct-d61b16cc0f17.herokuapp.com/users/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); // 存储token
      localStorage.setItem("userId", username);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      ); // 打印详细错误
      alert(
        "用戶名或密碼錯誤"
      );
    }
  };

  return (
    <div className="login-page">
      <form className="login-body" onSubmit={handleSubmit}>
        <div className="login-head">請登入您的帳號</div>
        <div>
        <input
          type="text"
          placeholder="帳號"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">登入</button>
        <p>
        没有會員？ <Link to="/register">加入</Link>
      </p>
      </form>
    </div>
  );
}

export default Login;
