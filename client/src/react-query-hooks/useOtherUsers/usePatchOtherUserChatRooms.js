import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import backendApi from "./../../utility/backendApi";

export default function usePatchOtherUserChatRooms(id) {
  //   const queryClient = useQueryClient();
  return useMutation(
    (chatRoom) =>
      axios.patch(`${backendApi}users/${id}/addOtherUserChatRoom`, chatRoom, {
        withCredentials: true,
        credentials: "include",
      })
    // .then((res) => res.data.data.user)
  );
}
