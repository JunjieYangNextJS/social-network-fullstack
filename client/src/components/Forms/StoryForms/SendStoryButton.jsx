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
import { useDidUpdate } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from 'react-query';
import { Check } from 'tabler-icons-react';
import useCreateStory from '../../../react-query-hooks/useStories/useCreateStory';
import usePatchStory from './../../../react-query-hooks/useStories/usePatchStory';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';

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

export default function SendStoryButton({
  title,
  hours,
  setHours,
  richText,
  about,
  userId,
  navigate,
  isDraft,
  storyId
}) {
  const { classes, theme } = useStyles();
  const menuIconColor =
    theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 6];

  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(false);
  const {
    mutate: createDraftStory,
    isSuccess,
    data,
    isLoading: storyIsLoading
  } = useCreateStory();
  const {
    mutate: patchStory,
    isLoading: patchIsLoading,
    isSuccess: isPatchSuccess
  } = usePatchStory(storyId);

  useDidUpdate(() => {
    if (isSuccess) {
      localStorage.setItem(`draft-${data?._id}`, richText);
      navigate(`/stories/draft/${data?._id}`);

      queryClient.invalidateQueries(['draftStories']);

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
      queryClient.invalidateQueries(['draftStories']);

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
    createDraftStory({
      content: richText,
      title,
      about,
      draft: true
    });
  };

  const handleUpdateDraft = () => {
    patchStory({
      content: richText,
      title,
      about,
      draft: true
    });
  };

  return (
    <Group noWrap spacing={0}>
      <Button
        className={classes.button}
        type="submit"
        disabled={
          !title ||
          patchIsLoading ||
          storyIsLoading ||
          isRichTextEmpty(richText)
        }
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
            disabled={
              !title?.trim() ||
              patchIsLoading ||
              storyIsLoading ||
              isRichTextEmpty(richText)
            }
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
