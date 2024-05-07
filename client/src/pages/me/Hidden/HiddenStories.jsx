import React, { useState, useEffect } from "react";

import { useGetHiddenStories } from "./../../../react-query-hooks/useUser/useGetBlocked";
import StoriesPageModel from "./../ItemsPageModel/StoriesPageModel";

export default function HiddenStories() {
  const { data: hiddenStories, isLoading } = useGetHiddenStories();

  return (
    <StoriesPageModel
      stories={hiddenStories}
      isLoading={isLoading}
      title="Hidden stories"
    />
  );
}
