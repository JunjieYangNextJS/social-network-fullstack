import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  Button,
  Menu,
  Loader,
  Center,
  Indicator,
  Tooltip
} from '@mantine/core';
import { ArrowBigDown, ArrowBigTop, Pinned } from 'tabler-icons-react';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../../utility/isRichTextEmpty';
import calcTimeAgo from './../../../../utility/calcTimeAgo';

import BookmarkLikeMoreIconGroups from './../../../../components/IconGroups/BookmarkLikeMoreIconGroups';

import RichTextEditor from '@mantine/rte';

import useDeleteStoryComment from './../../../../react-query-hooks/useStoryComments/useDeleteStoryComment';
import usePatchStoryComment from './../../../../react-query-hooks/useStoryComments/usePatchStoryComment';
import CommentActionMenu from './../../../../components/Menus/CommentActionMenu';

// import PostRepliesContainer from "./PostReplies/PostRepliesContainer";
import { useGetHoverOtherUser } from '../../../../react-query-hooks/useOtherUsers/useOtherUser';
import {
  showChangesAreMemorized,
  showError
} from '../../../../utility/showNotifications';
import StoryReplyCreateForm from './../../../../components/Forms/StoryForms/StoryReplyCreateForm';
import StoryRepliesContainer from './StoryReplies/StoryRepliesContainer';
import AvatarComponent from './../../../../components/AvatarComponent';

const useStyles = createStyles(theme => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm
  },

  commentBody: {
    marginLeft: 18,
    marginTop: 7,
    paddingLeft: 2,
    borderWidth: 4,
    borderRadius: 5,
    borderStyle: 'solid',
    borderRight: 'none',
    // borderImage: "black",
    borderImage: `linear-gradient(
      to bottom,
      #d9e1ecf8,
      rgba(0, 0, 0, 0)
    ) 1 100%;`
  }
}));

const PinnedStoryComment = ({
  storyComment,
  user,
  navigate,
  storyTellerProfileName,
  storyId,
  storyTellerId,
  pinned
}) => {
  const {
    commenter,
    content,
    createdAt,
    editedAt,
    id,
    images,
    likes,
    story,
    storyReplies,
    understated,
    storyTeller,
    willNotifyCommenter,
    subscribers
  } = storyComment;

  const { classes, theme } = useStyles();
  const {
    mutate: handleDeleteStoryComment,
    status: deleteStatus
  } = useDeleteStoryComment(storyId);

  const {
    mutate: patchStoryComment,
    isLoading: patchIsLoading,
    status: patchStatus
  } = usePatchStoryComment(id);

  const edited = ' (edited)';

  // story comment
  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richText, setRichText] = useState('');

  // story reply
  const [openReply, setOpenReply] = useState(false);
  const [expandReplies, setExpandReplies] = useState(true);

  useEffect(() => {
    setRichText(content);
  }, [content]);

  //   useDidUpdate(() => {
  //     if (patchStatus === "error" || deleteStatus === "error") {
  //       showError("Something went wrong, please try again later");
  //     }
  //   }, [patchStatus, deleteStatus]);

  const handleCancelEdit = () => {
    if (richText !== content) showChangesAreMemorized();
    setRichText(content);
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchStoryComment({ content: richText });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  const handleNavigateToComment = () => {
    if (!readOnly) return;
    navigate(`/story-comment/${id}`);
  };

  const rteRef = useRef();

  return (
    <div
      style={{
        paddingTop: 25
      }}
    >
      {pinned === id && (
        <>
          <Tooltip
            label="Pinned comment"
            withArrow
            openDelay={300}
            color="yellow"
            sx={{ paddingBottom: 3 }}
          >
            <Group spacing={2}>
              <Pinned
                size={17}
                sx={{ backgroundColor: theme.colors.yellow[5] }}
                color={theme.colors.yellow[5]}
              />{' '}
              <Text size="xs" color={theme.colors.gray[7]}>
                Pinned by {storyTellerProfileName}
              </Text>
            </Group>
          </Tooltip>
          {commenter?._id === '62d88288dcf0582d700a323f' ? (
            <Group>
              <Avatar
                src={commenter?.photo}
                alt={commenter?.profileName}
                radius="xl"
              />

              <div>
                <Text size="sm">{commenter?.profileName}</Text>
                <Text size="xs" color="dimmed">
                  {editedAt && 'deleted ' + calcTimeAgo(editedAt)}
                </Text>
              </div>
            </Group>
          ) : (
            <Group>
              <AvatarComponent
                creator={commenter}
                username={commenter?.username}
                profileName={commenter?.profileName}
                role={commenter?.role}
                photo={commenter?.photo}
                id={commenter?._id}
                creationId={id}
                myId={user?.id}
              />

              <div>
                <Text size="sm">{commenter?.profileName}</Text>
                <Text size="xs" color="dimmed">
                  {doneEdit
                    ? calcTimeAgo(editTime) + doneEdit
                    : editedAt
                    ? calcTimeAgo(editedAt) + edited
                    : calcTimeAgo(createdAt)}
                </Text>
              </div>
            </Group>
          )}
          <div className={classes.commentBody}>
            <RichTextEditor
              // placeholder="Post comment content"
              // mt="md"
              onClick={e =>
                e.target.currentSrc
                  ? window.open(e.target.currentSrc, '_blank', 'noopener')
                  : handleNavigateToComment()
              }
              id={`storyCommentContent${id}`}
              name={`storyCommentContent${id}`}
              key={`storyCommentContent${id}`}
              //   value={content}
              value={content}
              ref={rteRef}
              onChange={setRichText}
              readOnly={readOnly || user?.id !== commenter?.id}
              sx={{
                border: 'none',
                fontSize: 15,
                color: ' #343a40',
                cursor: readOnly ? 'pointer' : 'default'
              }}
            />

            {!readOnly && user?.id === commenter?.id && (
              <Group spacing="xs">
                <Button
                  variant="light"
                  color="gray"
                  size="xs"
                  disabled={isRichTextEmpty(richText) || patchIsLoading}
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
              {/* <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={() => rteRef.current?.editor?.setText("hehe")}
              >
                Set
              </Button> */}
              <BookmarkLikeMoreIconGroups
                itemLikes={likes}
                itemId={id}
                navigate={navigate}
                user={user}
                likedProperty="likedStoryComments"
                bookmarkedProperty="bookmarkedStoryComments"
                arrayMethod="StoryComment"
                patchEndPoint="storyComments"
                queryName={['pinnedStoryComment', pinned]}
                userBookmarkedItems={user?.bookmarkedStoryComments}
                bookmarkAddMethod="addBookmarkedStoryComment"
                bookmarkRemoveMethod="removeBookmarkedStoryComment"
                moreMenu={
                  <CommentActionMenu
                    itemId={id}
                    itemCreatorId={commenter.id}
                    setDataName={['story', storyId, 'comments']}
                    itemEndpoint="storyComments"
                    userId={user?._id}
                    userItems={user?.myStoryComments}
                    handleDeleteItem={handleDeleteStoryComment}
                    deleteStatus={deleteStatus}
                    setReadOnly={setReadOnly}
                    postOrStoryCreatorId={storyTellerId}
                    postOrStoryId={storyId}
                    postOrStoryRoute="stories"
                    pinned={pinned}
                    willNotifyCommenter={willNotifyCommenter}
                    understated={understated}
                    setRteText={rteRef}
                    pinnedQueryName="pinnedStoryComment"
                    subscribers={subscribers}
                    // index={index}
                  />
                }
              />
            </Group>
            {openReply && (
              <StoryReplyCreateForm
                user={user}
                storyId={storyId}
                storyCommentId={id}
                storyTitle={story?.title}
                setOpenReply={setOpenReply}
                willNotifyCommenter={willNotifyCommenter}
              />
            )}
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setExpandReplies(!expandReplies)}
            >
              <Group spacing={3}>
                {expandReplies ? (
                  <ArrowBigTop size={14} />
                ) : (
                  <ArrowBigDown size={14} />
                )}
                <Text size={14} color="gray">
                  Replies {storyReplies?.length}
                </Text>
              </Group>
            </Button>
            {expandReplies && (
              <StoryRepliesContainer
                replies={storyReplies}
                user={user}
                story={story}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PinnedStoryComment;
