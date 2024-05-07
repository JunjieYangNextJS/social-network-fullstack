import React from "react";
import { useGetMyStories } from "../../../react-query-hooks/useUser/useGetMyCreations";
import StoriesPageModel from "../ItemsPageModel/StoriesPageModel";

export default function MyStories() {
  const { data: myStories, isLoading } = useGetMyStories();

  return (
    <StoriesPageModel
      stories={myStories}
      isLoading={isLoading}
      title="My stories"
    />
  );
}
