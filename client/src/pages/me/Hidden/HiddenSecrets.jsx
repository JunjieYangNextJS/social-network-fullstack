import React, { useEffect, useState } from "react";
import CommentsPageModel from "./../ItemsPageModel/CommentsPageModel";
import axios from "axios";
import backendApi from "../../../utility/backendApi";
import { useDidUpdate } from "@mantine/hooks";
import { useQuery, useQueryClient } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";
import SecretsPageModel from "./../ItemsPageModel/SecretsPageModel";
import { useGetHiddenSecrets } from "./../../../react-query-hooks/useUser/useGetHidden";

export default function HiddenSecrets() {
  const { data: hiddenSecrets, isLoading } = useGetHiddenSecrets();

  // const queryClient = useQueryClient();
  // const { data: user } = useUser();
  // const limit = 20;

  // const fetchHiddenSecrets = (page = 1) => {
  //   return axios
  //     .get(`${backendApi}users/getHiddenSecrets?&limit=${limit}&page=` + page, {
  //       withCredentials: true,
  //     })
  //     .then((res) => res.data.data);
  // };

  // const [page, setPage] = useState(
  //   sessionStorage.getItem(`hiddenSecrets-page`) * 1 || 1
  // );

  // useDidUpdate(() => {
  //   sessionStorage.setItem(`hiddenSecrets-page`, page);
  //   // window.location.reload();
  // }, [page]);

  // const { status, data, error, isFetching, isPreviousData } = useQuery(
  //   ["hiddenSecrets", { page }],
  //   () => fetchHiddenSecrets(page),
  //   { keepPreviousData: true, staleTime: 1000 }
  // );

  // const total = Math.ceil(user?.hiddenSecrets?.length / limit);

  // // Prefetch the next page!
  // useEffect(() => {
  //   if (user?.hiddenSecrets?.length > page * limit) {
  //     queryClient.prefetchQuery(["hiddenSecrets", { page: page + 1 }], () =>
  //       fetchHiddenSecrets(page + 1)
  //     );
  //   }
  // }, [user?.hiddenSecrets, page, queryClient]);

  return (
    <>
      <SecretsPageModel
        title="Hidden secrets"
        secrets={hiddenSecrets}
        isLoading={isLoading}
      />
    </>
  );
}
