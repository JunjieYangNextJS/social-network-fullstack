import React, { useEffect, useState } from "react";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import StoryCommentCard from "./../../../components/Cards/CommentCards/StoryCommentCard";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";

export default function MyStoryComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getMyStoryComments?&limit=${limit}&page=` + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`myStoryComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`myStoryComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["myStoryComments", { page }],
    () => fetchStoryComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data?.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(["myStoryComments", { page: page + 1 }], () =>
        fetchStoryComments(page + 1)
      );
    }
  }, [data, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="My story-comments"
        isLoading={isFetching}
        comments={data?.data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
        isStory={true}
      />
    </>
  );
}
