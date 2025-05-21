import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const createPost = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !postText.trim()) {
      alert("タイトルと投稿内容を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        postText: postText.trim(),
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: new Date().toISOString(),
      });
      navigate("/");
    } catch (error) {
      console.error("投稿エラー:", error);
      alert("投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="createPost">
      <div className="createPost__container">
        <h1 className="createPost__title">記事を投稿する</h1>
        <div className="createPost__inputGroup">
          <label className="createPost__label">タイトル</label>
          <input
            type="text"
            className="createPost__input"
            placeholder="タイトルを記入"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="createPost__inputGroup">
          <label className="createPost__label">投稿</label>
          <textarea
            className="createPost__textarea"
            placeholder="投稿内容を記入"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>
        <button
          className="createPost__button"
          onClick={createPost}
          disabled={isSubmitting}
        >
          {isSubmitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
};
