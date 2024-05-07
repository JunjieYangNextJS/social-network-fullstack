import React from "react";
import PostsPageModel from "../ItemsPageModel/PostsPageModel";
import { useGetBookmarkedPosts } from "./../../../react-query-hooks/useUser/useGetBookmarked";

export default function BookmarkedPosts() {
  const { data, isLoading } = useGetBookmarkedPosts();

  return (
    <PostsPageModel
      posts={data}
      isLoading={isLoading}
      title="My bookmarked posts"
    />
  );
}
