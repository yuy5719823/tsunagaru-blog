import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { Comment } from "../Comment/Comment";
import "./Post.css";

// エラーメッセージの定数
const ERROR_MESSAGES = {
  AUTH_REQUIRED: "この操作を行うにはログインが必要です",
  COMMENT_EMPTY: "コメントを入力してください",
  COMMENT_TOO_LONG: "コメントは1000文字以内で入力してください",
  NETWORK_ERROR: "ネットワークエラーが発生しました。インターネット接続を確認してください",
  UNKNOWN_ERROR: "予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください",
  DELETE_ERROR: "投稿の削除に失敗しました",
  LIKE_ERROR: "いいねの更新に失敗しました",
  COMMENT_ERROR: "コメントの投稿に失敗しました",
};

export const Post = ({ post, onDelete, onUpdate }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  // 文字数が300文字を超える場合のみ開閉ボタンを表示
  const shouldShowToggle = post.postText.length > 300;

  const handleDelete = async () => {
    try {
      if (!auth.currentUser) {
        setError(ERROR_MESSAGES.AUTH_REQUIRED);
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (post.author.id !== auth.currentUser.uid) {
        setError("この投稿を削除する権限がありません");
        setTimeout(() => setError(null), 3000);
        return;
      }

      await deleteDoc(doc(db, "posts", post.id));
      onDelete(post.id);
    } catch (error) {
      console.error("投稿削除エラー:", error);
      console.error("エラーコード:", error.code);
      console.error("エラーメッセージ:", error.message);
      setError(ERROR_MESSAGES.DELETE_ERROR);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLike = async () => {
    if (!auth.currentUser) {
      setError(ERROR_MESSAGES.AUTH_REQUIRED);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = post.likes?.includes(auth.currentUser.uid);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
      }

      onUpdate(post.id, {
        ...post,
        likes: isLiked ? (post.likes || []).filter((id) => id !== auth.currentUser.uid) : [...(post.likes || []), auth.currentUser.uid],
      });
    } catch (error) {
      console.error("いいね更新エラー:", error);
      setError(ERROR_MESSAGES.LIKE_ERROR);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleComment = async () => {
    if (!auth.currentUser) {
      setError(ERROR_MESSAGES.AUTH_REQUIRED);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const comment = commentText.trim();
    if (!comment) {
      setError(ERROR_MESSAGES.COMMENT_EMPTY);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (comment.length > 1000) {
      setError(ERROR_MESSAGES.COMMENT_TOO_LONG);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const now = new Date();
      const commentRef = await addDoc(collection(db, `posts/${post.id}/comments`), {
        text: comment,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: serverTimestamp(),
      });

      const newComment = {
        id: commentRef.id,
        text: comment,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: now,
        replies: [],
      };

      onUpdate(post.id, {
        ...post,
        comments: [newComment, ...(post.comments || [])],
      });

      setCommentText("");
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      if (error.code === "permission-denied") {
        setError(ERROR_MESSAGES.AUTH_REQUIRED);
      } else if (error.code === "unavailable") {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setError(ERROR_MESSAGES.COMMENT_ERROR);
      }
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleReply = (commentId, newReply) => {
    try {
      onUpdate(post.id, {
        ...post,
        comments: post.comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [newReply, ...(comment.replies || [])],
            };
          }
          return comment;
        }),
      });
    } catch (error) {
      console.error("返信投稿エラー:", error);
      setError(ERROR_MESSAGES.COMMENT_ERROR);
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="post">
      {error && <div className="post__error">{error}</div>}
      <div className="post__header">
        <h1 className="post__title">{post.title}</h1>
      </div>
      <div className={`post__content ${isExpanded ? "post__content--expanded" : ""}`}>{post.postText}</div>
      {shouldShowToggle && (
        <button className="post__toggleButton" onClick={toggleContent}>
          <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
          {isExpanded ? "閉じる" : "続きを読む"}
        </button>
      )}
      <div className="post__footer">
        <div className="post__info">
          <h3 className="post__author">@{post.author.username}</h3>
          <div className="post__actions">
            <div className="post__like" onClick={handleLike}>
              <FontAwesomeIcon icon={faHeart} className={`post__likeIcon ${post.likes?.includes(auth.currentUser?.uid) ? "post__likeIcon--active" : ""}`} />
              <span className="post__likeCount">{post.likes?.length || 0}</span>
            </div>
            <div className="post__comment" onClick={toggleComments}>
              <FontAwesomeIcon icon={faComment} className="post__commentIcon" />
              <span className="post__commentCount">{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
        {post.author.id === auth.currentUser?.uid && (
          <button className="post__delete" onClick={handleDelete}>
            削除
          </button>
        )}
      </div>
      {showComments && (
        <div className="post__comments">
          <div className="post__commentForm">
            <textarea
              className="post__commentInput"
              placeholder="コメントを入力... (Ctrl/Command + Enterで送信)"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  handleComment();
                }
              }}
            />
            <button className="post__commentButton" onClick={handleComment}>
              コメント
            </button>
          </div>
          <div className="post__commentList">
            {post.comments?.map((comment) => (
              <Comment key={comment.id} postId={post.id} comment={comment} onReply={handleReply} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
