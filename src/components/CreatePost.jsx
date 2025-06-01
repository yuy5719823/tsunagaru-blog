import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { sanitizePost } from "../utils/sanitize";
import { getErrorMessage, getFirebaseErrorMessage } from "../utils/errorMessages";
import { getSecurityTokens } from "../utils/csrf";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const validatePost = () => {
    if (!title.trim()) {
      setError(getErrorMessage("POST", "INVALID_TITLE"));
      return false;
    }
    if (!postText.trim()) {
      setError(getErrorMessage("POST", "INVALID_CONTENT"));
      return false;
    }
    if (title.length > 100) {
      setError(getErrorMessage("POST", "TITLE_TOO_LONG"));
      return false;
    }
    if (postText.length > 10000) {
      setError(getErrorMessage("POST", "CONTENT_TOO_LONG"));
      return false;
    }
    return true;
  };

  const createPost = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    setError(null);
    if (!validatePost()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // セキュリティトークンの取得
      const { idToken, csrfToken } = await getSecurityTokens();

      const postData = {
        title: title.trim(),
        postText: postText.trim(),
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: new Date().toISOString(),
        csrfToken, // CSRFトークンを追加
      };

      // 投稿データをサニタイズ
      const sanitizedPost = sanitizePost(postData);

      // FirestoreのセキュリティルールでCSRFトークンを検証
      await addDoc(collection(db, "posts"), sanitizedPost);
      navigate("/");
    } catch (error) {
      console.error("投稿エラー:", error);
      setError(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createPost">
      <div className="createPost__container">
        <h1 className="createPost__title">記事を投稿する</h1>
        {error && <div className="createPost__error">{error}</div>}
        <div className="createPost__inputGroup">
          <label className="createPost__label">タイトル</label>
          <input
            type="text"
            className="createPost__input"
            placeholder="タイトルを記入"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
          />
        </div>
        <div className="createPost__inputGroup">
          <label className="createPost__label">投稿</label>
          <textarea
            className="createPost__textarea"
            placeholder="投稿内容を記入"
            value={postText}
            onChange={(e) => {
              setPostText(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isSubmitting) {
                createPost();
              }
            }}
          ></textarea>
        </div>
        <button className="createPost__button" onClick={createPost} disabled={isSubmitting}>
          {isSubmitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
};
