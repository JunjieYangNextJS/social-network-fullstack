import React, { useEffect, useState } from "react";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function LikedStoryComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getLikedStoryComments?&limit=${limit}&page=` + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`likedStoryComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`likedStoryComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["likedStoryComments", { page }],
    () => fetchStoryComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.likedStoryComments?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.likedStoryComments?.length > page * limit) {
      queryClient.prefetchQuery(
        ["likedStoryComments", { page: page + 1 }],
        () => fetchStoryComments(page + 1)
      );
    }
  }, [user?.likedStoryComments, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="Liked story-comments"
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
