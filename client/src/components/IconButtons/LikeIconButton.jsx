import React, { useState, useEffect } from 'react';

import { useQueryClient, useMutation } from 'react-query';
import { Heart } from 'tabler-icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useDidUpdate } from '@mantine/hooks';

import { showError } from '../../utility/showNotifications';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

export default function LikeIconButton({
  itemLikes,

  user,

  navigate,

  theme,
  queryName,
  likedProperty,
  itemId,
  itemModel,
  notFunctional
}) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [clickable, setClickable] = useState(false);

  const [mutableItemLikes, setMutableItemLikes] = useState(0);

  const { mutate: patchItemLikes, status } = useMutation(
    values =>
      axios
        .patch(`${backendApi}users/patchLikedItems`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onMutate: async values => {
        await queryClient.cancelQueries(queryName);
      }
    }
  );

  useEffect(() => {
    if (status !== 'idle') return;
    if (itemLikes?.includes(user?.id)) {
      setLiked(true);
      setClickable(true);
    } else {
      setLiked(false);
      setClickable(true);
    }
  }, [itemLikes, status, user]);

  useDidUpdate(() => {
    if (status === 'error') {
      showError('Something went wrong, please try again later');
    }
  }, [status]);

  useEffect(() => {
    if (itemLikes) {
      setMutableItemLikes(itemLikes.length);
    }
  }, [itemLikes, setMutableItemLikes]);

  const handleLikes = async e => {
    e.preventDefault();
    if (!user) return navigate('/login', { push: true });
    if (!clickable) return;

    if (liked) {
      setLiked(false);
      patchItemLikes({ method: '$pull', likedProperty, itemId });

      setMutableItemLikes(prev => prev - 1);
    } else {
      setLiked(true);
      patchItemLikes({ method: '$addToSet', likedProperty, itemId });

      setMutableItemLikes(prev => prev + 1);
    }
  };

  return (
    <>
      {notFunctional ? (
        <ActionIcon variant="transparent">
          <Heart size={15} color={liked ? theme.colors.red[6] : '#343a40'} />
          {mutableItemLikes > 0 && mutableItemLikes}
        </ActionIcon>
      ) : (
        <Tooltip
          wrapLines
          withArrow
          transition="fade"
          transitionDuration={200}
          label="Likes"
        >
          <ActionIcon aria-label="like" onClick={e => handleLikes(e)}>
            <Heart size={16} color={liked ? theme.colors.red[6] : '#343a40'} />
            {mutableItemLikes > 0 && mutableItemLikes}
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
}
