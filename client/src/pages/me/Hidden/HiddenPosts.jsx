import React, { useState, useEffect, useMemo, useRef } from "react";

import { useGetHiddenPosts } from "../../../react-query-hooks/useUser/useGetHidden";

import PostsPageModel from "../ItemsPageModel/PostsPageModel";

export default function HiddenPosts() {
  const { data: hiddenPosts, isLoading } = useGetHiddenPosts();

  return (
    <PostsPageModel
      posts={hiddenPosts}
      isLoading={isLoading}
      title="Hidden posts"
    />
  );
}
