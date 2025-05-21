import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faReply } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
  const [postList, setPostList] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showReplies, setShowReplies] = useState({});

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getDocs(collection(db, "posts"));
      const postsData = await Promise.all(
        posts.docs.map(async (doc) => {
          const postData = { ...doc.data(), id: doc.id };
          // コメントを取得（最新順）
          const commentsQuery = query(
            collection(db, `posts/${doc.id}/comments`),
            orderBy("createdAt", "desc")
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          const comments = await Promise.all(
            commentsSnapshot.docs.map(async (commentDoc) => {
              const commentData = commentDoc.data();
              // 返信を取得（最新順）
              const repliesQuery = query(
                collection(db, `posts/${doc.id}/comments/${commentDoc.id}/replies`),
                orderBy("createdAt", "desc")
              );
              const repliesSnapshot = await getDocs(repliesQuery);
              const replies = repliesSnapshot.docs.map(replyDoc => ({
                ...replyDoc.data(),
                id: replyDoc.id,
                createdAt: replyDoc.data().createdAt?.toDate?.() || new Date()
              }));
              return {
                ...commentData,
                id: commentDoc.id,
                createdAt: commentData.createdAt?.toDate?.() || new Date(),
                replies
              };
            })
          );
          return { ...postData, comments };
        })
      );
      setPostList(postsData);
    };
    getPosts();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    window.location.href = "/";
  };

  const handleLike = async (post) => {
    if (!auth.currentUser) {
      alert("いいねするにはログインが必要です");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    const isLiked = post.likes?.includes(auth.currentUser.uid);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(auth.currentUser.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(auth.currentUser.uid)
      });
    }

    // 投稿リストを更新
    setPostList(postList.map((p) => {
      if (p.id === post.id) {
        const newLikes = isLiked
          ? (p.likes || []).filter(id => id !== auth.currentUser.uid)
          : [...(p.likes || []), auth.currentUser.uid];
        return { ...p, likes: newLikes };
      }
      return p;
    }));
  };

  const handleComment = async (postId) => {
    if (!auth.currentUser) {
      alert("コメントするにはログインが必要です");
      return;
    }

    const comment = commentText[postId]?.trim();
    if (!comment) {
      alert("コメントを入力してください");
      return;
    }

    try {
      const now = new Date();
      const commentRef = await addDoc(collection(db, `posts/${postId}/comments`), {
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
        replies: []
      };

      setPostList(postList.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [newComment, ...(post.comments || [])]
          };
        }
        return post;
      }));

      setCommentText({ ...commentText, [postId]: "" });
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      alert("コメントの投稿に失敗しました");
    }
  };

  const handleReply = async (postId, commentId) => {
    if (!auth.currentUser) {
      alert("返信するにはログインが必要です");
      return;
    }

    const reply = replyText[commentId]?.trim();
    if (!reply) {
      alert("返信を入力してください");
      return;
    }

    try {
      const now = new Date();
      const replyRef = await addDoc(collection(db, `posts/${postId}/comments/${commentId}/replies`), {
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
        createdAt: now
      };

      setPostList(postList.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [newReply, ...(comment.replies || [])]
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));

      setReplyText({ ...replyText, [commentId]: "" });
    } catch (error) {
      console.error("返信投稿エラー:", error);
      alert("返信の投稿に失敗しました");
    }
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
  };

  const toggleReplies = (commentId) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId]
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("日付のフォーマットエラー:", error);
      return "";
    }
  };

  return (
    <div className="home">
      {postList.map((post) => (
        <div className="post" key={post.id}>
          <div className="post__header">
            <h1 className="post__title">{post.title}</h1>
          </div>
          <div className="post__content">{post.postText}</div>
          <div className="post__footer">
            <div className="post__info">
              <h3 className="post__author">@{post.author.username}</h3>
              <div className="post__actions">
                <div className="post__like" onClick={() => handleLike(post)}>
                  <FontAwesomeIcon 
                    icon={faHeart} 
                    className={`post__likeIcon ${post.likes?.includes(auth.currentUser?.uid) ? 'post__likeIcon--active' : ''}`}
                  />
                  <span className="post__likeCount">{post.likes?.length || 0}</span>
                </div>
                <div className="post__comment" onClick={() => toggleComments(post.id)}>
                  <FontAwesomeIcon icon={faComment} className="post__commentIcon" />
                  <span className="post__commentCount">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
            {post.author.id === auth.currentUser?.uid && (
              <button className="post__delete" onClick={() => handleDelete(post.id)}>
                削除
              </button>
            )}
          </div>
          {showComments[post.id] && (
            <div className="post__comments">
              <div className="post__commentForm">
                <textarea
                  className="post__commentInput"
                  placeholder="コメントを入力... (Ctrl/Command + Enterで送信)"
                  value={commentText[post.id] || ""}
                  onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      handleComment(post.id);
                    }
                  }}
                />
                <button
                  className="post__commentButton"
                  onClick={() => handleComment(post.id)}
                >
                  コメント
                </button>
              </div>
              <div className="post__commentList">
                {post.comments?.map((comment) => (
                  <div key={comment.id} className="post__commentItem">
                    <div className="post__commentHeader">
                      <span className="post__commentAuthor">@{comment.author.username}</span>
                      <span className="post__commentDate">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="post__commentText">{comment.text}</p>
                    <div className="post__commentActions">
                      <button
                        className="post__replyButton"
                        onClick={() => toggleReplies(comment.id)}
                      >
                        <FontAwesomeIcon icon={faReply} className="post__replyIcon" />
                        返信 {comment.replies?.length || 0}
                      </button>
                    </div>
                    {showReplies[comment.id] && (
                      <div className="post__replies">
                        <div className="post__replyForm">
                          <textarea
                            className="post__replyInput"
                            placeholder="返信を入力... (Ctrl/Command + Enterで送信)"
                            value={replyText[comment.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                handleReply(post.id, comment.id);
                              }
                            }}
                          />
                          <button
                            className="post__replySubmitButton"
                            onClick={() => handleReply(post.id, comment.id)}
                          >
                            返信
                          </button>
                        </div>
                        <div className="post__replyList">
                          {comment.replies?.map((reply) => (
                            <div key={reply.id} className="post__replyItem">
                              <div className="post__replyHeader">
                                <span className="post__replyAuthor">@{reply.author.username}</span>
                                <span className="post__replyDate">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="post__replyText">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
