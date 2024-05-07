import React, { useState } from 'react';
import { Menu, ActionIcon, Tooltip } from '@mantine/core';
import {
  Settings,
  Pin,
  AccessPointOff,
  MessageCircleOff
} from 'tabler-icons-react';
import { useDisclosure, useDidUpdate } from '@mantine/hooks';

import usePatchChatRoomFromMeBoolean, {
  usePatchRemoveChatRoom
} from '../../../react-query-hooks/useChats/uesPatchChatRoomFromMeBoolean';

export default function ChatConfigMenu({ chatRoomId, userObj }) {
  const [opened, handlers] = useDisclosure(false);
  const [disabled, setDisabled] = useState(false);

  const { mutate, isLoading, isSuccess } = usePatchChatRoomFromMeBoolean();

  const { mutate: removeChatRoom } = usePatchRemoveChatRoom();

  useDidUpdate(() => {
    if (isLoading) {
      handlers.close();
    }
    if (isSuccess) {
      setDisabled(false);
    }
  }, [isLoading, isSuccess]);

  const handlePinnedChat = () => {
    if (disabled === true) return;

    if (userObj.pinned) {
      setDisabled(true);

      mutate({ chatRoomId, boolean: false, method: 'pinned' });
    } else {
      setDisabled(true);

      mutate({ chatRoomId, boolean: true, method: 'pinned' });
    }
  };

  const handleMuteChat = () => {
    if (disabled === true) return;

    if (userObj.muted) {
      setDisabled(true);

      mutate({ chatRoomId, boolean: false, method: 'muted' });
    } else {
      setDisabled(true);

      mutate({ chatRoomId, boolean: true, method: 'muted' });
    }
  };

  const handleLeaveChat = () => {
    if (disabled === true) return;

    setDisabled(true);

    mutate({ chatRoomId, boolean: true, method: 'left' });
  };

  const handleRemoveChat = () => {
    if (disabled === true) return;

    setDisabled(true);
    removeChatRoom({ chatRoomId });
    handlers.close();
  };

  return (
    <Menu
      opened={opened}
      onOpen={handlers.open}
      onClose={handlers.close}
      closeOnItemClick={false}
      control={
        <ActionIcon>
          <Settings size={18} />
        </ActionIcon>
      }
    >
      <Tooltip
        label="Pinned chats will always be at the top"
        sx={{ width: '100%' }}
      >
        <Menu.Item icon={<Pin size={14} />} onClick={() => handlePinnedChat()}>
          {userObj?.pinned ? 'Unpin chat' : 'Pin chat'}
        </Menu.Item>
      </Tooltip>

      <Tooltip
        label="Muted chats will not send you notifications"
        sx={{ width: '100%' }}
      >
        <Menu.Item
          icon={<AccessPointOff size={14} />}
          onClick={() => handleMuteChat()}
        >
          {userObj?.muted ? 'Unmute chat' : 'Mute chat'}
        </Menu.Item>
      </Tooltip>

      <Tooltip
        label="This chat will disappear from your list until you receive new messages"
        sx={{ width: '100%' }}
      >
        <Menu.Item
          icon={<MessageCircleOff size={14} />}
          onClick={() => handleLeaveChat()}
        >
          Leave chat
        </Menu.Item>
      </Tooltip>

      <Tooltip
        label="This chat is removed from your list until you proactively chat with them"
        sx={{ width: '100%' }}
      >
        <Menu.Item
          icon={<MessageCircleOff size={14} color="red" />}
          onClick={() => handleRemoveChat()}
        >
          Remove chat
        </Menu.Item>
      </Tooltip>
    </Menu>
  );
}
