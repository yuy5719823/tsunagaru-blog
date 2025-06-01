import { auth } from "../firebase";

// CSRFトークンを生成
export const generateCSRFToken = () => {
  const token = Math.random().toString(36).substring(2);
  sessionStorage.setItem("csrfToken", token);
  return token;
};

// CSRFトークンを検証
export const verifyCSRFToken = (token) => {
  const storedToken = sessionStorage.getItem("csrfToken");
  return token === storedToken;
};

// 認証トークンとCSRFトークンを取得
export const getSecurityTokens = async () => {
  const idToken = await auth.currentUser?.getIdToken(true);
  const csrfToken = generateCSRFToken();
  return { idToken, csrfToken };
};
