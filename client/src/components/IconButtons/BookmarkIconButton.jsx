import React, { useState, useEffect } from 'react';
import { Bookmark } from 'tabler-icons-react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { usePatchArrayMethod } from '../../react-query-hooks/useUser/usePatchUser';
import { showError, showSuccess } from './../../utility/showNotifications';
import { useDidUpdate } from '@mantine/hooks';
import axios from 'axios';
import backendApi from './../../utility/backendApi';
import { useMutation, useQueryClient } from 'react-query';

export default function BookmarkIconButton({
  navigate,
  user,
  userBookmarkedItems,
  theme,
  bookmarkedProperty,
  itemId,
  notFunctional
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [clickable, setClickable] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: patchItemBookmarks, status, data } = useMutation(
    values =>
      axios
        .patch(`${backendApi}users/patchBookmarkedItems`, values, {
          withCredentials: true,
          credentials: 'include'
        })
        .then(res => res.data),
    {
      onMutate: async values => {
        await queryClient.cancelQueries(['user']);
      },

      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
      }
    }
  );

  useDidUpdate(() => {
    if (status === 'error')
      showError('Something went wrong, please try again later');

    if (data?.statement) showSuccess(data?.statement);
  }, [status, data]);

  useEffect(() => {
    if (status !== 'idle') return;
    if (userBookmarkedItems?.includes(itemId)) {
      setBookmarked(true);
      setClickable(true);
    } else {
      setBookmarked(false);
      setClickable(true);
    }
  }, [userBookmarkedItems, status, itemId]);

  const handleBookmarks = async e => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) return navigate('/login', { push: true });

    if (!clickable) return;

    if (bookmarked) {
      setBookmarked(false);
      patchItemBookmarks({ method: '$pull', bookmarkedProperty, itemId });
    } else {
      setBookmarked(true);
      patchItemBookmarks({ method: '$addToSet', bookmarkedProperty, itemId });
    }
  };

  return (
    <>
      {notFunctional ? (
        <ActionIcon variant="transparent">
          <Bookmark
            size={16}
            color={bookmarked ? theme?.colors.yellow[6] : '#343a40'}
          />
        </ActionIcon>
      ) : (
        <Tooltip
          wrapLines
          withArrow
          transition="fade"
          transitionDuration={200}
          label="Bookmarks"
        >
          <ActionIcon onClick={e => handleBookmarks(e)} aria-label="bookmark">
            <Bookmark
              size={16}
              color={bookmarked ? theme?.colors.yellow[6] : '#343a40'}
            />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
}
