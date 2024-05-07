import React, { useEffect, useState } from "react";
// import RepliesPageModel from "./../ItemsPageModel/RepliesPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";
import RepliesPageModel from "../ItemsPageModel/RepliesPageModel";

export default function MyStoryReplies() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchStoryReplies = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getMyStoryReplies?&limit=${limit}&page=` + page,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`myStoryReplies-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`myStoryReplies-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ["myStoryReplies", { page }],
    () => fetchStoryReplies(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data?.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(["myStoryReplies", { page: page + 1 }], () =>
        fetchStoryReplies(page + 1)
      );
    }
  }, [data, page, queryClient]);

  return (
    <>
      <RepliesPageModel
        title="My story-replies"
        isLoading={isFetching}
        replies={data?.data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
        isStory={true}
      />
    </>
  );
}
