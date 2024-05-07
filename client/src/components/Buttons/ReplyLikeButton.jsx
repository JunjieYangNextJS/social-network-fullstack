import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Heart } from 'tabler-icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useDidUpdate, useDebouncedValue } from '@mantine/hooks';
import axios from 'axios';
import backendApi from '../../utility/backendApi';
import { showError } from '../../utility/showNotifications';

export default function ReplyLikeButton({
  itemLikes,
  itemId,
  user,
  navigate,
  theme,

  itemReplies,
  queryName
}) {
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  // const [likeIsClicked, setLikeIsClicked] = useState(false);

  const [mutableItemLikes, setMutableItemLikes] = useState(0);

  const { mutate: patchItemLikes, status } = useMutation(
    values =>
      axios
        .patch(`${backendApi}${itemReplies}/updateLikes/${itemId}`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onMutate: async values => {
        await queryClient.cancelQueries(queryName);
        // setMutableItemLikes((prev) => prev + 1);
        // if (values.method === "$pull") {
        //   setMutableItemLikes(itemLikes - 1);
        // } else {
        //   setMutableItemLikes(itemLikes + 1);
        // }
      },

      onSuccess: () => {
        queryClient.invalidateQueries(queryName);
      }
    }
  );

  useEffect(() => {
    if (status !== 'idle') return;
    if (itemLikes?.includes(user?.id)) {
      setLiked(true);
    } else {
      setLiked(false);
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
    e.stopPropagation();
    e.preventDefault();
    if (!user) return navigate('/login', { push: true });

    if (liked) {
      setLiked(false);
      patchItemLikes({ method: '$pull' });
      setMutableItemLikes(prev => prev - 1);
    } else {
      setLiked(true);
      patchItemLikes({ method: '$addToSet' });
      setMutableItemLikes(prev => prev + 1);
    }
  };

  return (
    <Tooltip
      wrapLines
      withArrow
      transition="fade"
      transitionDuration={200}
      label="Likes"
    >
      <ActionIcon
        aria-label="like"
        onClick={e => handleLikes(e)}
        sx={{ marginRight: -9 }}
      >
        <Heart size={16} color={liked ? theme.colors.red[6] : '#343a40'} />
        {mutableItemLikes > 0 && mutableItemLikes}
      </ActionIcon>
    </Tooltip>
  );
}
