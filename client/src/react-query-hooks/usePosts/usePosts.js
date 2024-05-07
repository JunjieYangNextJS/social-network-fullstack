import { useQuery, useInfiniteQuery } from "react-query";
import axios from "axios";
import backendApi from "../../utility/backendApi";

// export default function usePosts() {
//   return useInfiniteQuery(
//     "posts",
//     ({ pageParam = 2 }) =>
//       axios.get(`${backendApi}posts?limit=10&page=${pageParam}`, {
//         withCredentials: true,
//       }),

//     // .then((res) => res.data.data.data),
//     { getNextPageParam: (lastPage, pages) => lastPage.nextCursor }
//   );
// }

export function useSearchQueryPosts(searchQuery) {
  return useQuery(searchQuery && ["posts/searchQuery", searchQuery], () =>
    axios
      .get(`${backendApi}posts/searchQuery/${searchQuery}`, {
        withCredentials: true,
      })
      .then((res) => res.data.data.data)
  );
}
