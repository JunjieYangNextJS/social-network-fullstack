import React from "react";
import {
  usePatchUserFriendList,
  useRemoveUserFriendRequest,
} from "./../../../react-query-hooks/useUser/usePatchUser";
import { Button, Group } from "@mantine/core";

export default function AcceptDeclineButtons({
  requesterId,
  requesterUsername,
}) {
  const { mutate: patchUserRemoveFriendRequest, isLoading } =
    useRemoveUserFriendRequest();

  const { mutate: patchUserAcceptFriendRequest, isLoading: acceptIsLoading } =
    usePatchUserFriendList(
      requesterUsername,
      `acceptFriendRequest`,
      requesterId
    );

  const handleAccept = () => {
    patchUserAcceptFriendRequest();
  };

  const handleDecline = () => {
    patchUserRemoveFriendRequest({ otherUserId: requesterId });
  };

  return (
    <Group>
      {" "}
      <Button
        size="sm"
        variant="subtle"
        onClick={() => handleAccept()}
        disabled={acceptIsLoading || isLoading}
      >
        Accept
      </Button>
      <Button
        size="sm"
        variant="subtle"
        onClick={() => handleDecline()}
        disabled={acceptIsLoading || isLoading}
      >
        Decline
      </Button>
    </Group>
  );
}
