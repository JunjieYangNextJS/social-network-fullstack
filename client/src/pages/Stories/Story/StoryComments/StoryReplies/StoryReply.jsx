import React, { useState, useEffect } from 'react';
import {
  Container,
  Group,
  Avatar,
  Text,
  Button,
  useMantineTheme,
  Center,
  Loader,
  Menu,
  Indicator
} from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import calcTimeAgo from './../../../../../utility/calcTimeAgo';
import isRichTextEmpty from './../../../../../utility/isRichTextEmpty';
import usePatchStoryReply from './../../../../../react-query-hooks/useStoryReplies/usePatchStoryReply';
import StoryReplyCreateForm from '../../../../../components/Forms/StoryForms/StoryReplyCreateForm';
import {
  showChangesAreMemorized,
  showSuccess,
  showTitleless
} from './../../../../../utility/showNotifications';
import ReplyLikeButton from './../../../../../components/Buttons/ReplyLikeButton';
import ReplyActionMenu from './../../../../../components/Menus/ReplyActionMenu';
import { useNavigate } from 'react-router-dom';
import useDeleteStoryReply from './../../../../../react-query-hooks/useStoryReplies/useDeleteStoryReply';
import AvatarComponent from './../../../../../components/AvatarComponent';

export default function StoryReply({ reply, user, fontSize }) {
  const {
    replier,
    id,
    content,
    createdAt,
    editedAt,
    story,
    storyComment,
    likes
  } = reply;
  const edited = ' (edited)';

  const theme = useMantineTheme();
  const navigate = useNavigate();

  // story comment
  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richTextReply, setRichTextReply] = useState('');

  const [openReply, setOpenReply] = useState(false);

  const {
    mutate: deleteStoryReply,
    status: deleteStatus
  } = useDeleteStoryReply(story, storyComment);

  const {
    mutate: patchStoryReply,
    isLoading: patchIsLoading,
    isSuccess: patchingIsSuccess
  } = usePatchStoryReply(id, story);

  useEffect(() => {
    setRichTextReply(content);
  }, [content]);

  useEffect(() => {
    if (patchingIsSuccess) showSuccess('Changes are saved.');
  }, [patchingIsSuccess]);

  const handleCancelEdit = () => {
    if (richTextReply !== content) showChangesAreMemorized();

    setRichTextReply(content);
    showTitleless('Changes are memorized, but not saved');
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchStoryReply({ content: richTextReply });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  return (
    <>
      {replier && reply && (
        <div style={{ marginTop: 12 }}>
          <Group>
            <AvatarComponent
              creator={replier}
              username={replier?.username}
              profileName={replier?.profileName}
              role={replier?.role}
              photo={replier?.photo}
              id={replier?._id}
              creationId={id}
              myId={user?.id}
            />
            <div>
              <Text size="sm">{replier?.profileName}</Text>
              <Text size="xs" color="dimmed">
                {doneEdit
                  ? calcTimeAgo(editTime) + doneEdit
                  : editedAt
                  ? calcTimeAgo(editedAt) + edited
                  : calcTimeAgo(createdAt)}
              </Text>
            </div>
          </Group>
          <RichTextEditor
            onClick={e =>
              e.target.currentSrc &&
              window.open(e.target.currentSrc, '_blank', 'noopener')
            }
            // placeholder="Post comment content"
            // mt="md"
            id={`storyReply${id}`}
            name={`storyReply${id}`}
            key={`storyReply${id}`}
            value={content}
            onChange={setRichTextReply}
            readOnly={readOnly || user?.id !== replier?.id}
            sx={{
              border: 'none',
              fontSize: fontSize || 15,
              color: ' #343a40'
            }}
          />

          {!readOnly && user?.id === replier?.id && (
            <Group spacing="xs">
              <Button
                variant="light"
                color="gray"
                size="xs"
                disabled={isRichTextEmpty(richTextReply) || patchIsLoading}
                onClick={() => handleConfirmEdit()}
              >
                Confirm
              </Button>
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={() => handleCancelEdit()}
              >
                Cancel
              </Button>
            </Group>
          )}
          <Group spacing="xs">
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setOpenReply(!openReply)}
            >
              Reply
            </Button>
            <ReplyLikeButton
              itemLikes={likes}
              itemId={id}
              navigate={navigate}
              theme={theme}
              user={user}
              itemReplies="storyReplies"
              queryName={['story', story, 'comments']}
            />

            <ReplyActionMenu
              itemId={id}
              itemCreatorId={replier._id}
              setDataName={['story', story, 'comments']}
              itemEndpoint="storyReplies"
              userId={user?._id}
              handleDeleteItem={deleteStoryReply}
              deleteStatus={deleteStatus}
              setReadOnly={setReadOnly}
            />
          </Group>
          {openReply && (
            <StoryReplyCreateForm
              user={user}
              storyId={story}
              storyCommentId={storyComment}
              setOpenReply={setOpenReply}
              //   refetch={refetch}
              //   index={index}
              repliedTo={
                replier?.username === user?.username
                  ? null
                  : `<span><u>@${replier?.username}</u> </span>`
              }
            />
          )}
        </div>
      )}
    </>
  );
}
