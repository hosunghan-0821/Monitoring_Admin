import React, { useState } from 'react';
import './login.css';

// 1) 검증 로직 분리
function validateCredentials(username, password) {
  if (!username.trim() || !password.trim()) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return false;
  }
  return true;
}

function Login({ onLogin }) {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const submit = async () => {

      if (!validateCredentials(user, pass)) {
        return; // 검증 실패 시 중단
      }

      setLoading(true);
      setError(null);

      try {
        
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, password: pass }),
        });
  
        if (!res.ok) {
          // HTTP 에러 코드 처리
          const errMsg = await res.text();
          throw new Error(errMsg || `HTTP ${res.status}`);
        }
  
        const result = await res.json();
        // ② 로그인 성공 결과를 부모(onLogin)로 전달
        onLogin(result);
  
      } catch (err) {
        // 에러 메시지 상태에 저장 → 렌더링 시 표시
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if(error) {
      alert("로그인 실패")
    }
  
    return (
        <div className="login-page">
          <div className="login-card">
            <h1 className="login-title">로그인</h1>
            <input
              className="login-input"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="아이디"
            />
            <input
              className="login-input"
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="비밀번호"
            />
            <button className="login-button" onClick={submit}>
              로그인
            </button>
          </div>
        </div>
      );
  }

  export default Login;