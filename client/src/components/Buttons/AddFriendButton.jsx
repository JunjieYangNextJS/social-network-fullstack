import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { usePatchOtherUserFriendRequest } from '../../react-query-hooks/useOtherUsers/usePatchOtherUser';
import AddFriendModal from '../Modals/UserRelated/AddFriendModal';

export default function AddFriendButton({
  user,
  otherUser,
  navigate,
  allowFriending
}) {
  const {
    mutate: patchOtherUserReceiveFriendRequest,
    isLoading,
    isSuccess,
    status
  } = usePatchOtherUserFriendRequest(
    otherUser?.username,
    `receiveFriendRequest`,
    otherUser?.id
  );

  const [friendStatus, setFriendStatus] = useState('Pending');
  const [modalOpened, setModalOpened] = useState(false);
  const [value, setValue] = useState('Are are you doing?');

  useEffect(() => {
    if (user && otherUser) {
      if (user.friendList.find(user => user.id === otherUser._id))
        return setFriendStatus('Friended');
      if (
        otherUser?.incomingFriendRequests.some(
          request => request.userId === user?.id
        )
      )
        return setFriendStatus('Pending');
      return setFriendStatus('Add friend');
    }
  }, [user, otherUser]);

  useEffect(() => {
    if (isSuccess) {
      setModalOpened(false);
    }
  }, [isSuccess]);

  const handleSendFriendRequest = () => {
    if (!user) return navigate('/login', { push: true });
    if (friendStatus === 'Pending' || friendStatus === 'Friended') return;

    patchOtherUserReceiveFriendRequest({
      userId: user.id,
      username: user.username,
      profileName: user.profileName,
      photo: user.photo,
      role: user.role,
      message: value
    });
    setFriendStatus('Pending');
  };

  console.log(status);

  return (
    <>
      {!allowFriending ? (
        <Tooltip label="This person disallowed friending">
          <Button
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
            radius="xl"
            disabled={
              friendStatus === 'Pending' ||
              friendStatus === 'Friended' ||
              !allowFriending
            }
          >
            {friendStatus}
          </Button>
        </Tooltip>
      ) : (
        <Button
          variant="gradient"
          gradient={{ from: 'orange', to: 'red' }}
          radius="xl"
          disabled={friendStatus === 'Pending' || friendStatus === 'Friended'}
          onClick={() => setModalOpened(true)}
        >
          {friendStatus}
        </Button>
      )}
      <AddFriendModal
        otherUserUsername={otherUser?.username}
        opened={modalOpened}
        setOpened={setModalOpened}
        value={value}
        setValue={setValue}
        isLoading={isLoading}
        handleSendFriendRequest={handleSendFriendRequest}
      />
    </>
  );
}
