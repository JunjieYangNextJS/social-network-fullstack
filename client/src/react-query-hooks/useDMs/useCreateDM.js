import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "./../../utility/backendApi";

export default function useCreateDM() {
  return useMutation((values) =>
    axios
      .post(
        `${backendApi}DM`,

        values,
        {
          withCredentials: true,
        }
      )
      .then((res) => res.data.data.data)
  );
}
