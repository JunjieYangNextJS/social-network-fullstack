import React, { useEffect, useState } from "react";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function LikedPostComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchPostComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getLikedPostComments?&limit=${limit}&page=` + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`likedPostComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`likedPostComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["likedPostComments", { page }],
    () => fetchPostComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.likedPostComments?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.likedPostComments?.length > page * limit) {
      queryClient.prefetchQuery(["likedPostComments", { page: page + 1 }], () =>
        fetchPostComments(page + 1)
      );
    }
  }, [user?.likedPostComments, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="Liked post-comments"
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
