import React, { useState, useEffect } from 'react';
import { Button, Modal, Tooltip } from '@mantine/core';
import {
  useFollowOtherUser,
  useUnfollowOtherUser
} from '../../react-query-hooks/useOtherUsers/usePatchOtherUser';
import { useDidUpdate } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from 'react-query';

export default function FollowButton({
  myId,
  otherUserId,
  otherUserUsername,
  otherUserFollowers,
  fullWidth,
  compact,
  allowFollowing,
  setMaxWidth,
  hoverQueryName
}) {
  const [followed, setFollowed] = useState('Follow');
  const [opened, setOpened] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: followOtherUser, status: adding } = useFollowOtherUser(
    otherUserId,
    otherUserUsername,
    otherUserFollowers,
    myId
  );
  const { mutate: unfollowOtherUser, status: removing } = useUnfollowOtherUser(
    otherUserId,
    otherUserUsername,
    otherUserFollowers,
    myId
  );

  useEffect(() => {
    if (
      otherUserFollowers?.includes(myId) &&
      removing === 'idle' &&
      adding === 'idle'
    )
      setFollowed('Following');
  }, [otherUserFollowers, adding, removing, myId]);

  const handleFollowOtherUser = async e => {
    e.stopPropagation();
    e.preventDefault();
    if (!myId) return navigate('/login', { push: true });
    if (followed === 'Unfollow' || followed === 'Following') {
      setOpened(true);
    } else {
      if (setMaxWidth) setMaxWidth(140);
      setFollowed('Following');
      if (hoverQueryName) {
        await queryClient.cancelQueries(hoverQueryName);
        queryClient.setQueryData(hoverQueryName, old => ({
          ...old,
          followers: [...old.followers, myId]
        }));
      }
      followOtherUser();
    }
  };

  useDidUpdate(async () => {
    if (removing === 'loading') {
      if (setMaxWidth) setMaxWidth(170);
      setFollowed('Follow');
      if (hoverQueryName) {
        await queryClient.cancelQueries(hoverQueryName);
        queryClient.setQueryData(hoverQueryName, old => ({
          ...old,
          followers: old.followers.filter(el => el !== myId)
        }));
      }
      setOpened(false);
    }
  }, [removing]);

  return (
    <>
      {!allowFollowing ? (
        <Tooltip label="This person disallowed following" zIndex={99999}>
          <Button
            radius="xl"
            variant="gradient"
            fullWidth={fullWidth}
            compact={compact}
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            onClick={() => handleFollowOtherUser()}
            onMouseEnter={
              followed === 'Following'
                ? () => setFollowed('Unfollow')
                : undefined
            }
            onMouseLeave={
              followed === 'Unfollow'
                ? () => setFollowed('Following')
                : undefined
            }
            disabled={!allowFollowing}
          >
            {followed}
          </Button>
        </Tooltip>
      ) : (
        <Button
          radius="xl"
          variant="gradient"
          fullWidth={fullWidth}
          compact={compact}
          gradient={{ from: 'teal', to: 'lime', deg: 105 }}
          onClick={e => handleFollowOtherUser(e)}
          onMouseEnter={
            followed === 'Following' ? () => setFollowed('Unfollow') : undefined
          }
          onMouseLeave={
            followed === 'Unfollow' ? () => setFollowed('Following') : undefined
          }
          disabled={!allowFollowing}
        >
          {followed}
        </Button>
      )}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        title="Are you sure about this?"
        centered
        onClick={e => e.preventDefault()}
      >
        <Button size="sm" variant="light" onClick={() => unfollowOtherUser()}>
          Unfollow
        </Button>
        <Button size="sm" variant="light" onClick={() => setOpened(false)}>
          Cancel
        </Button>
      </Modal>
    </>
  );
}
