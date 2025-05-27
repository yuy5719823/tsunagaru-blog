import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import "./Comment.css";

export const Comment = ({ postId, comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = async () => {
    if (!auth.currentUser) {
      alert("返信するにはログインが必要です");
      return;
    }

    const reply = replyText.trim();
    if (!reply) {
      alert("返信を入力してください");
      return;
    }

    try {
      const now = new Date();
      const replyRef = await addDoc(collection(db, `posts/${postId}/comments/${comment.id}/replies`), {
        text: reply,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: serverTimestamp(),
      });

      const newReply = {
        id: replyRef.id,
        text: reply,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: now,
      };

      onReply(comment.id, newReply);
      setReplyText("");
    } catch (error) {
      console.error("返信投稿エラー:", error);
      alert("返信の投稿に失敗しました");
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("日付のフォーマットエラー:", error);
      return "";
    }
  };

  return (
    <div className="comment">
      <div className="comment__header">
        <span className="comment__author">@{comment.author.username}</span>
        <span className="comment__date">{formatDate(comment.createdAt)}</span>
      </div>
      <p className="comment__text">{comment.text}</p>
      <div className="comment__actions">
        <button className="comment__replyButton" onClick={toggleReplies}>
          <FontAwesomeIcon icon={faReply} className="comment__replyIcon" />
          返信 {comment.replies?.length || 0}
        </button>
      </div>
      {showReplies && (
        <div className="comment__replies">
          <div className="comment__replyForm">
            <textarea
              className="comment__replyInput"
              placeholder="返信を入力... (Ctrl/Command + Enterで送信)"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleReply();
                }
              }}
            />
            <button className="comment__replySubmitButton" onClick={handleReply}>
              返信
            </button>
          </div>
          <div className="comment__replyList">
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="comment__replyItem">
                <div className="comment__replyHeader">
                  <span className="comment__replyAuthor">@{reply.author.username}</span>
                  <span className="comment__replyDate">{formatDate(reply.createdAt)}</span>
                </div>
                <p className="comment__replyText">{reply.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
