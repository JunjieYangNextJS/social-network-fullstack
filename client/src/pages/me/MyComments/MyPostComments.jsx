import React, { useEffect, useState } from 'react';

import CommentsPageModel from './../ItemsPageModel/CommentsPageModel';

import axios from 'axios';
import backendApi from '../../../utility/backendApi';
import { useDidUpdate } from '@mantine/hooks';
import { useQuery, useQueryClient } from 'react-query';
import useUser from './../../../react-query-hooks/useUser/useUser';

export default function MyPostComments() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchPostComments = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getMyPostComments?&limit=${limit}&page=` + page,
        {
          withCredentials: true
        }
      )
      .then(res => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`myPostComments-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`myPostComments-page`, page);
    // window.location.reload();
  }, [page]);

  const { data, isFetching } = useQuery(
    ['myPostComments', { page }],
    () => fetchPostComments(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data?.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(['myPostComments', { page: page + 1 }], () =>
        fetchPostComments(page + 1)
      );
    }
  }, [data, page, queryClient]);

  return (
    <>
      <CommentsPageModel
        title="My post-comments"
        isLoading={isFetching}
        comments={data?.data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
      />
    </>
  );
}
