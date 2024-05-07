import { Button, Group, Modal, Text, Textarea } from '@mantine/core';
import React, { useState } from 'react';

export default function AddFriendModal({
  otherUserUsername,
  opened,
  setOpened,
  handleSendFriendRequest,
  isLoading,
  value,
  setValue
}) {
  return (
    <Modal
      withCloseButton={false}
      centered
      opened={opened}
      onClose={() => setOpened(false)}
      size="sm"
      padding="xl"
    >
      <div style={{ padding: '10px 10px 0 10px' }}>
        <Text color="#373A40" size="lg" weight={700}>
          Add @{otherUserUsername}
        </Text>
        <Textarea
          label="Hey!"
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
          sx={{ margin: '20px 0 10px 0' }}
        />
        <Group position="right">
          <Button
            size="sm"
            variant="subtle"
            onClick={() => handleSendFriendRequest()}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
            Cancel
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
