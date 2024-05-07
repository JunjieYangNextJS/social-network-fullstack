import React, { useEffect, useState } from "react";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function BookmarkedStoryComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getBookmarkedStoryComments?&limit=${limit}&page=` +
          page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`bookmarkedStoryComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`bookmarkedStoryComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["bookmarkedStoryComments", { page }],
    () => fetchStoryComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.bookmarkedStoryComments?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.bookmarkedStoryComments?.length > page * limit) {
      queryClient.prefetchQuery(
        ["bookmarkedStoryComments", { page: page + 1 }],
        () => fetchStoryComments(page + 1)
      );
    }
  }, [user?.bookmarkedStoryComments, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="Bookmarked story-comments"
        isLoading={isFetching}
        comments={data}
        isStory={true}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
      />
    </>
  );
}
