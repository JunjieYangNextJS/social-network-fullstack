import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Group,
  Avatar,
  Text,
  Button,
  createStyles,
  useMantineTheme,
  Center,
  Loader,
  Menu,
  Indicator
} from '@mantine/core';
import RichTextEditor from '@mantine/rte';
import { useNavigate } from 'react-router-dom';
import calcTimeAgo from '../../../../../utility/calcTimeAgo';
import isRichTextEmpty from '../../../../../utility/isRichTextEmpty';
import usePatchPostReply from '../../../../../react-query-hooks/usePostReplies/usePatchPostReply';
import PostReplyCreateForm from '../../../../../components/Forms/PostForms/PostReplyCreateForm';
import ReplyActionMenu from '../../../../../components/Menus/ReplyActionMenu';
import useDeletePostReply from '../../../../../react-query-hooks/usePostReplies/useDeletePostReply';
import {
  showTitleless,
  showSuccess,
  showChangesAreUpdated,
  showChangesAreMemorized
} from '../../../../../utility/showNotifications';
import ReplyLikeButton from '../../../../../components/Buttons/ReplyLikeButton';
import AvatarComponent from './../../../../../components/AvatarComponent';

export default function PostReply({ reply, user, refetch, index, fontSize }) {
  const {
    replier,
    _id,
    content,
    createdAt,
    editedAt,
    post,
    postComment,
    likes
  } = reply;
  const edited = ' (edited)';

  const theme = useMantineTheme();
  const navigate = useNavigate();

  // post comment
  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richTextReply, setRichTextReply] = useState('');
  const richTextRef = useRef('');

  const [openReply, setOpenReply] = useState(false);

  const {
    mutate: patchPostReply,
    isLoading: patchIsLoading,
    isSuccess: patchingIsSuccess
  } = usePatchPostReply(_id, post);

  const { mutate: deletePostReply, status: deleteStatus } = useDeletePostReply(
    post,
    postComment
  );

  useEffect(() => {
    setRichTextReply(content);
  }, [content]);

  useEffect(() => {
    if (patchingIsSuccess) showChangesAreUpdated();
  }, [patchingIsSuccess]);

  const handleCancelEdit = () => {
    setRichTextReply(content);

    if (richTextRef.current.value !== content) showChangesAreMemorized();
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchPostReply({ content: richTextReply });
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
              creationId={_id}
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
            key={`postReply${_id}`}
            // placeholder="Post comment content"
            // mt="md"
            id={`postReply${_id}`}
            name={`postReply${_id}`}
            value={content}
            ref={richTextRef}
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
              itemId={_id}
              navigate={navigate}
              theme={theme}
              user={user}
              itemReplies="postReplies"
              queryName={['post', post, 'comments']}
            />

            <ReplyActionMenu
              itemId={_id}
              itemCreatorId={replier._id}
              setDataName={['post', post, 'comments']}
              itemEndpoint="postReplies"
              userId={user?._id}
              handleDeleteItem={deletePostReply}
              deleteStatus={deleteStatus}
              setReadOnly={setReadOnly}
              invalidateCommentPage={['postComment', postComment]}
            />
          </Group>
          {openReply && (
            <PostReplyCreateForm
              user={user}
              postId={post}
              postCommentId={postComment}
              setOpenReply={setOpenReply}
              refetch={refetch}
              index={index}
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
