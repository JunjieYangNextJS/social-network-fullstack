import React from "react";
import { Modal, Button, Group, Container, Text } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { usePatchUserFriendList } from "../../../react-query-hooks/useUser/usePatchUser";

export default function RemoveFriendModal({
  opened,
  setOpened,
  friendUsername,
  friendId,
  meId,
}) {
  const { mutate: patchUserRemoveFriend, isLoading } = usePatchUserFriendList(
    friendUsername,
    `removeFriend`,
    friendId
  );

  const handleDeleteFriend = () => {
    patchUserRemoveFriend();
  };

  useDidUpdate(() => {
    if (isLoading) {
      setOpened(false);
    }
  }, [isLoading]);

  return (
    <Modal
      size="sm"
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      centered
      padding="xl"
    >
      <div style={{ padding: "10px 10px 0 10px" }}>
        <Text color="#373A40" size="lg" weight={700}>
          Unfriend @{friendUsername}?
        </Text>
        <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
          @{friendUsername} will be removed from your friend list. They will no
          longer have access to your friends-only areas. They will not be
          notified, but your username will quietly disappear from their friend
          list.
        </Text>
        <Group position="right">
          <Button
            size="sm"
            variant="subtle"
            onClick={() => handleDeleteFriend()}
            disabled={isLoading}
          >
            Unfriend
          </Button>
          <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
