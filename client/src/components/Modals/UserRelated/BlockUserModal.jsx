import React from "react";
import { Modal, Button, Title, Text, Group } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { usePatchArrayMethod } from "../../../react-query-hooks/useUser/usePatchUser";

export default function BlockUserModal({
  opened,
  setOpened,
  id,
  blockedUsers,
  otherUserUsername,
}) {
  const { mutate: addBlockUser, isLoading: addLoading } =
    usePatchArrayMethod("addBlockedUser");
  const { mutate: removeBlockUser, isLoading: removeLoading } =
    usePatchArrayMethod("removeBlockedUser");

  // const handleBlockUser = () => {
  //   blockUser(id);
  // };

  useDidUpdate(() => {
    if (addLoading || removeLoading) {
      setOpened(false);
    }
  }, [addLoading, removeLoading]);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      centered
      size="sm"
      padding="xl"
    >
      {blockedUsers?.includes(id) ? (
        <div style={{ padding: "10px 10px 0 10px" }}>
          <Text color="#373A40" size="lg" weight={700}>
            Unblock @{otherUserUsername}?
          </Text>
          <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
            @{otherUserUsername} will be able to view your profile page, follow
            you, start a new chat with you or send you a friend request. Their
            posts and stories will no longer be hidden away from you.
          </Text>
          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => removeBlockUser(id)}
              disabled={addLoading || removeLoading}
            >
              Unblock
            </Button>
            <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </div>
      ) : (
        <div style={{ padding: "10px 10px 0 10px" }}>
          <Text color="#373A40" size="lg" weight={700}>
            Block @{otherUserUsername}?
          </Text>
          <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
            @{otherUserUsername} can no longer follow you, start a new chat with
            you or send you a friend request. Your profile page will be
            protected from viewing. Their posts and stories will be hidden away
            from you.
          </Text>
          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => addBlockUser(id)}
              disabled={addLoading || removeLoading}
            >
              Block
            </Button>
            <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </div>
      )}
    </Modal>
  );
}
