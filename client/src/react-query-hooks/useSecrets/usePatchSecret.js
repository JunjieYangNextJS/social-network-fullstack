import axios from "axios";
import { useMutation, queryCache, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";

export default function usePatchSecret(secretId) {
  const queryClient = useQueryClient();
  return useMutation(
    (values) =>
      axios
        .patch(`${backendApi}secrets/${secretId}`, values, {
          withCredentials: true,
          credentials: "include",
        })
        .then((res) => res.data.data),
    {
      // onMutate: async (newsecret) => {
      //   await queryClient.cancelQueries(["secret", secretId]);

      //   const previoussecret = JSON.parse(
      //     JSON.stringify(queryClient.getQueryData(["secret", secretId]))
      //   );

      //   queryClient.setQueryData(["secret", secretId], (oldsecret) => {
      //     const updated = { ...oldsecret };

      //     updated.likes = oldsecret.likes + 1;
      //     return updated;
      //   });

      //   return { previoussecret };
      // },

      // onError: (err, newsecret, context) => {
      //   queryClient.setQueryData(
      //     ["secret", context.secretId],
      //     context.previoussecret
      //   );
      // },

      onSuccess: (data) => {
        queryClient.setQueryData(["secret", secretId], (old) => ({
          secret: data,
          comments: old.comments,
        }));
      },
    }
  );
}

// export function usePatchLikes(secret, secretId, ...options) {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (values) =>
//       axios
//         .patch(`${backendApi}secrets/${secretId}/from-viewers`, values, {
//           withCredentials: true,
//           credentials: "include",
//         })
//         .then((res) => res.data.data.data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(["secret", secretId]);
//       },
//     }
//   );
// }

export function usePatchViewCount(route) {
  return useMutation((secretId) =>
    axios
      .patch(
        `${backendApi}${route}/${secretId}/update-viewCount`,
        {}
        // {
        //   withCredentials: true,
        //   credentials: "include",
        // }
      )
      .then((res) => res.data.data.data)
  );
}
