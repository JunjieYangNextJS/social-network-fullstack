import React, { useEffect, useState } from 'react';
import CommentsPageModel from './../ItemsPageModel/CommentsPageModel';
import axios from 'axios';
import backendApi from '../../../utility/backendApi';
import { useDidUpdate } from '@mantine/hooks';
import { useQuery, useQueryClient } from 'react-query';
import useUser from './../../../react-query-hooks/useUser/useUser';
import SecretsPageModel from './../ItemsPageModel/SecretsPageModel';

export default function MySecrets() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const limit = 10;

  const fetchMySecrets = (page = 1) => {
    return axios
      .get(`${backendApi}users/getMySecrets?&limit=${limit}&page=` + page, {
        withCredentials: true
      })
      .then(res => res.data);
  };

  const [page, setPage] = useState(
    sessionStorage.getItem(`mySecrets-page`) * 1 || 1
  );

  useDidUpdate(() => {
    sessionStorage.setItem(`mySecrets-page`, page);
    // window.location.reload();
  }, [page]);

  const { status, data, error, isFetching, isPreviousData } = useQuery(
    ['mySecrets', { page }],
    () => fetchMySecrets(page),
    { keepPreviousData: true, staleTime: 1000 }
  );

  const total = Math.ceil(data?.totalDocsInDB / limit);

  // Prefetch the next page!
  useEffect(() => {
    if (data && data.totalDocsInDB > page * limit) {
      queryClient.prefetchQuery(['mySecrets', { page: page + 1 }], () =>
        fetchMySecrets(page + 1)
      );
    }
  }, [data, page, queryClient]);

  return (
    <>
      <SecretsPageModel
        title="My voices"
        isLoading={isFetching}
        secrets={data?.data}
        total={total}
        setPage={setPage}
        page={page}
        user={user}
      />
    </>
  );
}
