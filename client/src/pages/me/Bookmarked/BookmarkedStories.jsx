import React from "react";
import { useGetBookmarkedStories } from "../../../react-query-hooks/useUser/useGetBookmarked";
import StoriesPageModel from "../ItemsPageModel/StoriesPageModel";

export default function BookmarkedStories() {
  const { data, isLoading } = useGetBookmarkedStories();

  return (
    <StoriesPageModel
      stories={data}
      isLoading={isLoading}
      title="My bookmarked stories"
    />
  );
}
