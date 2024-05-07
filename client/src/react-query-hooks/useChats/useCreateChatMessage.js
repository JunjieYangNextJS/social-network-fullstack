import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "../../utility/backendApi";
import { usePatchArrayMethod } from "../useUser/usePatchUser";
import usePatchOtherUserChatRooms from "../useOtherUsers/usePatchOtherUserChatRooms";

export default function useCreateChatMessage(chatRoomId, otherUserObj) {
  // const { mutate: increment } = useIncrementChatRoomTotalMessagesAndUnread(
  //   chatRoomId,
  //   otherUserObj
  // );

  return useMutation(
    (values) =>
      axios.post(`${backendApi}chatMessages`, values, {
        withCredentials: true,
        credentials: "include",
      })

    // {
    //   onMutate: () => {
    //     increment();
    //   },
    // }
  );
}

// export function useIncrementChatRoomTotalMessagesAndUnread(
//   chatRoomId,
//   otherUserId
// ) {
//   const queryClient = useQueryClient();
//   return useMutation(
//     () =>
//       axios
//         .patch(
//           `${backendApi}chatRooms/${chatRoomId}/increment`,
//           { otherUserId },
//           {
//             withCredentials: true,
//             credentials: "include",
//           }
//         )
//         .then((res) => res.data),
//     {
//       onSuccess: (data) => {
//         queryClient.invalidateQueries("user");
//       },
//     }
//   );
// }
