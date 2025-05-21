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
    <div className="homePage">
      {postList.map((post) => (
        <div className="postContents" key={post.id}>
          <div className="postHeader">
            <h1>{post.title}</h1>
          </div>
          <div className="postTextContainer">{post.postText}</div>
          <div className="nameAndDeleteButton">
            <div className="postInfo">
              <h3>@{post.author.username}</h3>
              <div className="likeButton" onClick={() => handleLike(post)}>
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={post.likes?.includes(auth.currentUser?.uid) ? "liked" : ""}
                />
                <span>{post.likes?.length || 0}</span>
              </div>
            </div>
            {post.author.id === auth.currentUser?.uid && (
              <button className="deleteButton" onClick={() => handleDelete(post.id)}>
                削除
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
