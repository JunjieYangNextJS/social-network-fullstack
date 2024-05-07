import React, { useEffect, useState } from 'react';
import RepliesPageModel from './../ItemsPageModel/RepliesPageModel';
import axios from 'axios';
import backendApi from '../../../utility/backendApi';
import { useDidUpdate } from '@mantine/hooks';
import { useQuery, useQueryClient } from 'react-query';
import useUser from './../../../react-query-hooks/useUser/useUser';

export default function LikedPostReplies() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 20;

  const fetchPostReplies = (page = 1) => {
    return axios
      .get(
        `${backendApi}users/getLikedPostReplies?&limit=${limit}&page=` + page,
        {
          withCredentials: true
        }
      )
      .then(res => res.data.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`likedPostReplies-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`likedPostReplies-page`, page);
  }, [page]);

  const { data, isFetching } = useQuery(
    ['likedPostReplies', { page }],
    () => fetchPostReplies(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(user?.likedPostReplies?.length / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (user?.likedPostReplies?.length > page * limit) {
      queryClient.prefetchQuery(['likedPostReplies', { page: page + 1 }], () =>
        fetchPostReplies(page + 1)
      );
    }
  }, [user?.likedPostReplies, page, queryClient]);

  return (
    <>
      <RepliesPageModel
        title="Liked post-replies"
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
