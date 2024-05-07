import React, { useState, useEffect } from 'react';
import { createStyles, Button, Menu, Group, ActionIcon } from '@mantine/core';
import {
  Trash,
  Bookmark,
  Calendar,
  ChevronDown,
  Writing
} from 'tabler-icons-react';
import ScheduleLaterModal from '../../Modals/ScheduleLaterModal';
import useCreatePost from '../../../react-query-hooks/usePosts/useCreatePost';
import { useDidUpdate } from '@mantine/hooks';
import usePatchPost from '../../../react-query-hooks/usePosts/usePatchPost';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from 'react-query';
import { Check } from 'tabler-icons-react';

const useStyles = createStyles(theme => ({
  button: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },

  menuControl: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: 0,
    borderLeft: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`
  }
}));

export default function SendPostButton({
  title,
  hours,
  setHours,
  richText,
  about,
  navigate,
  isDraft,
  postId,
  willNotify,
  exposedTo
}) {
  const { classes, theme } = useStyles();
  const menuIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(false);
  const {
    mutate: createDraftPost,
    isSuccess,
    data,
    isLoading: postIsLoading
  } = useCreatePost();
  const {
    mutate: patchPost,
    isLoading: patchIsLoading,
    isSuccess: isPatchSuccess
  } = usePatchPost(postId);

  useDidUpdate(() => {
    if (isSuccess) {
      localStorage.setItem(`draft-${data?._id}`, richText);
      navigate(`/posts/draft/${data?._id}`);

      queryClient.invalidateQueries(['draftPosts']);

      showNotification({
        title: 'Great',
        message: 'Your new draft has been created!',
        color: 'teal',
        icon: <Check />,
        autoClose: 5000
      });
    }
  }, [isSuccess, data?._id]);

  useDidUpdate(() => {
    if (isPatchSuccess) {
      queryClient.invalidateQueries(['draftPosts']);

      showNotification({
        title: 'Great',
        message: 'Your draft has been updated!',
        color: 'teal',
        icon: <Check />,
        autoClose: 5000
      });
    }
  }, [isPatchSuccess]);

  const handleSaveDraft = () => {
    createDraftPost({
      content: richText,
      title,
      about,
      draft: true,
      willNotify,
      exposedTo
    });
  };

  const handleUpdateDraft = () => {
    patchPost({
      content: richText,
      title,
      about,
      draft: true,
      willNotify,
      exposedTo
    });
  };

  return (
    <Group noWrap spacing={0}>
      <Button
        className={classes.button}
        type="submit"
        disabled={!title || patchIsLoading || postIsLoading}
      >
        Send
      </Button>
      <Menu
        control={
          <ActionIcon
            variant="filled"
            color={theme.primaryColor}
            size={36}
            className={classes.menuControl}
            disabled={!title?.trim()}
          >
            <ChevronDown size={16} />
          </ActionIcon>
        }
        transition="pop"
        placement="end"
      >
        <Menu.Item
          icon={<Calendar size={16} color={menuIconColor} />}
          onClick={() => setOpened(true)}
        >
          Schedule for later
        </Menu.Item>
        {isDraft ? (
          <>
            <Menu.Item
              icon={<Writing size={16} color={menuIconColor} />}
              onClick={() => handleUpdateDraft()}
            >
              Update draft
            </Menu.Item>
            <Menu.Item
              icon={<Writing size={16} color={menuIconColor} />}
              onClick={() => handleSaveDraft()}
            >
              Save as new draft
            </Menu.Item>
          </>
        ) : (
          <Menu.Item
            icon={<Writing size={16} color={menuIconColor} />}
            onClick={() => handleSaveDraft()}
          >
            Save draft
          </Menu.Item>
        )}
      </Menu>
      <ScheduleLaterModal
        opened={opened}
        setOpened={setOpened}
        hours={hours}
        setHours={setHours}
      />
    </Group>
  );
}
