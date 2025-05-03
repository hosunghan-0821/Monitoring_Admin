import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 마운트 시 백엔드에 로그인 여부 확인
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/auth/session`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => {
        setIsLoggedIn(res.ok);
        navigate(location.pathname, { replace: true });
      })
      .catch(() => {
        setIsLoggedIn(false);
        navigate("/login");
      });
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    navigate("/");
  };
  const logout = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      setIsLoggedIn(false);
      navigate("/login");
    });
  };

  // 로딩 상태 처리
  if (isLoggedIn === null) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
