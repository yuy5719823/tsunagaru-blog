import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const posts = await getDocs(collection(db, "posts"));
      setPostList(posts.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
              <div className="post__like" onClick={() => handleLike(post)}>
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={`post__like-icon ${post.likes?.includes(auth.currentUser?.uid) ? 'post__like-icon--active' : ''}`}
                />
                <span className="post__like-count">{post.likes?.length || 0}</span>
              </div>
            </div>
            {post.author.id === auth.currentUser?.uid && (
              <button className="post__delete" onClick={() => handleDelete(post.id)}>
                削除
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
