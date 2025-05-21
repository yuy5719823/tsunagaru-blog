import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Post } from "./Post/Post";
import "./Home.css";

export const Home = () => {
  const [postList, setPostList] = useState([]);

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

  const handleDelete = (postId) => {
    setPostList(postList.filter(post => post.id !== postId));
  };

  const handleUpdate = (postId, updatedPost) => {
    setPostList(postList.map(post => 
      post.id === postId ? updatedPost : post
    ));
  };

  return (
    <div className="home">
      {postList.map((post) => (
        <Post
          key={post.id}
          post={post}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};
