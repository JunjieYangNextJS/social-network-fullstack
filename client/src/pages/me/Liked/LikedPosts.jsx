import React from "react";
import PostsPageModel from "../ItemsPageModel/PostsPageModel";
import { useGetLikedPosts } from "./../../../react-query-hooks/useUser/useGetLiked";

export default function LikedPosts() {
  const { data, isLoading } = useGetLikedPosts();

  return (
    <PostsPageModel posts={data} isLoading={isLoading} title="My liked posts" />
  );
}
