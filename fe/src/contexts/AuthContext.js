import { createContext, useState, useEffect,useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
  
    // 마운트 시 백엔드에 로그인 여부 확인
    useEffect(() => {
      fetch(`${process.env.REACT_APP_API_BASE}/api/auth/session`, {
        credentials: 'include',
        method: 'GET'
      })
        .then(res => setIsLoggedIn(res.ok))
        .catch(() => setIsLoggedIn(false));
    }, []);
  
    const login = () => setIsLoggedIn(true);
    const logout = () => {
      fetch(`${process.env.REACT_APP_API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      }).finally(() => setIsLoggedIn(false));
    };
  
    // 로딩 상태 처리
    if (isLoggedIn === null) return <div>Loading...</div>;
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  }