import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

// 1) 검증 로직 분리
function validateCredentials(username, password) {
  if (!username.trim() || !password.trim()) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return false;
  }
  return true;
}

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // 전역 login 액션

  const submit = async () => {
    if (!validateCredentials(user, pass)) {
      return; // 검증 실패 시 중단
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user, password: pass }),
          credentials: "include",
        }
      );
      if (!res.ok) {
        // HTTP 에러 코드 처리
        const errMsg = await res.text();
        throw new Error(errMsg || `HTTP ${res.status}`);
      }
      login();
    } catch (err) {
      alert("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="아이디"
          />
          <input
            className="login-input"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="비밀번호"
          />
          <button className="login-button" type="submit">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
