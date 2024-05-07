import React, { useEffect, useState } from "react";
import RepliesPageModel from "./../ItemsPageModel/RepliesPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function LikedStoryReplies() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryReplies = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getLikedStoryReplies?&limit=${limit}&page=` + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`likedStoryReplies-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`likedStoryReplies-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["likedStoryReplies", { page }],
    () => fetchStoryReplies(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.likedStoryReplies?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.likedStoryReplies?.length > page * limit) {
      queryClient.prefetchQuery(["likedStoryReplies", { page: page + 1 }], () =>
        fetchStoryReplies(page + 1)
      );
    }
  }, [user?.likedStoryReplies, page, queryClient]);

  return (
    <>
      <RepliesPageModel
        title="Liked story-replies"
        isLoading={isFetching}
        replies={data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
      />
    </>
  );
}
