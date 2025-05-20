import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Home.css";

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

  return (
    <div className="homePage">
      {postList.map((post) => (
        <div className="postContents" key={post.id}>
          <div className="postHeader">
            <h1>{post.title}</h1>
          </div>
          <div className="postTextContainer">{post.postText}</div>
          <div className="nameAndDeleteButton">
            <h3>@{post.author.username}</h3>
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
