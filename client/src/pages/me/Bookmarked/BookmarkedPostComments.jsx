import React, { useEffect, useState } from "react";
import { useMyPostComments } from "../../../react-query-hooks/usePostComments/usePostComments";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function BookmarkedPostComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchPostComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getBookmarkedPostComments?&limit=${limit}&page=` +
          page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`bookmarkedPostComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`bookmarkedPostComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["bookmarkedPostComments", { page }],
    () => fetchPostComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.bookmarkedPostComments?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.bookmarkedPostComments?.length > page * limit) {
      queryClient.prefetchQuery(
        ["bookmarkedPostComments", { page: page + 1 }],
        () => fetchPostComments(page + 1)
      );
    }
  }, [user?.bookmarkedPostComments, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="Bookmarked post-comments"
        isLoading={isFetching}
        comments={data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
      />
    </>
  );
}
