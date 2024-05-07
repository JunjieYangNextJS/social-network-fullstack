import React, { useState, useEffect, useMemo, useRef } from "react";

import { useGetMyPosts } from "../../../react-query-hooks/useUser/useGetMyCreations";

import PostsPageModel from "./../ItemsPageModel/PostsPageModel";

export default function MyPosts() {
  const { data: myPosts, isLoading } = useGetMyPosts();

  return (
    <PostsPageModel posts={myPosts} isLoading={isLoading} title="My posts" />
  );
}
