import React from "react";

import { useGetLikedStories } from "../../../react-query-hooks/useUser/useGetLiked";

import StoriesPageModel from "../ItemsPageModel/StoriesPageModel";

export default function LikedStories() {
  const { data: likedStories, isLoading } = useGetLikedStories();

  return (
    <StoriesPageModel
      stories={likedStories}
      isLoading={isLoading}
      title="My liked stories"
    />
  );
}
