import { useQuery, useInfiniteQuery } from "react-query";
import axios from "axios";
import backendApi from "../../utility/backendApi";

export default function useGetWhatIsNew(limit) {
  return useQuery(["whatIsNew", limit], () =>
    axios
      .get(`${backendApi}news/whatIsNew?limit=${limit}`)
      .then((res) => res.data.data.data)
  );
}
