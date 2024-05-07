import React, { useEffect, useMemo, useState } from 'react';
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
  Box,
  Card,
  ActionIcon,
  Title,
  Divider,
  Stack,
  Indicator
} from '@mantine/core';
import { ArrowBigDown, ArrowBigLeft, ArrowBigTop } from 'tabler-icons-react';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import useDeletePostComment from './../../../react-query-hooks/usePostComments/useDeletePostComment';
import usePatchPostComment from './../../../react-query-hooks/usePostComments/usePatchPostComment';
import { useGetHoverOtherUser } from '../../../react-query-hooks/useOtherUsers/useOtherUser';
import {
  showChangesAreMemorized,
  showError
} from '../../../utility/showNotifications';
import calcTimeAgo from '../../../utility/calcTimeAgo';
import RichTextEditor from '@mantine/rte';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import BookmarkLikeMoreIconGroups from './../../../components/IconGroups/BookmarkLikeMoreIconGroups';
import CommentActionMenu from './../../../components/Menus/CommentActionMenu';
import PostReplyCreateForm from './../../../components/Forms/PostForms/PostReplyCreateForm';
import useGetComment from './../../../react-query-hooks/useGetComment';
import useRelatedAndUnresponsedPosts from './../../../react-query-hooks/usePosts/useRelatedAndUnresponsedPosts';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useUser from './../../../react-query-hooks/useUser/useUser';
import PostReply from './../../Posts/Post/PostComments/PostReplies/PostReply';
import PostRightStack from './../../Posts/Post/PostRightStack';
import AvatarComponent from './../../../components/AvatarComponent';

const useStyles = createStyles(theme => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm
  },

  commentBody: {
    marginLeft: 18,
    marginTop: 12,
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

const PostCommentPage = () => {
  let params = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const {
    isLoading,
    isError,
    isSuccess,
    data: comment,
    error,
    status
  } = useGetComment('postComments', params.postCommentId, 'postComment');

  const { data: relatedAndUnresponsedPosts } = useRelatedAndUnresponsedPosts(
    comment?.post?._id,
    comment?.post?.about
  );

  const { classes } = useStyles();
  const {
    mutate: handleDeletePostComment,
    status: deleteStatus
  } = useDeletePostComment(comment?.post?._id);

  const {
    mutate: patchPostComment,
    isLoading: patchIsLoading,
    isError: patchIsError
  } = usePatchPostComment(comment?.id);

  const edited = ' (edited)';

  // post comment
  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richText, setRichText] = useState('');

  // post reply
  const [openReply, setOpenReply] = useState(false);

  const [showMyReply, setShowMyReply] = useState(false);

  const sortedReplies = useMemo(() => {
    if (comment?.postReplies) {
      const cloned = [...comment.postReplies];
      return cloned.sort((a, _b) => (a.replier?._id === user?.id ? -1 : 1));
    }
  }, [comment?.postReplies, user?.id]);

  useEffect(() => {
    setRichText(comment?.content);
  }, [comment?.content]);

  useDidUpdate(() => {
    if (patchIsError || deleteStatus === 'error') {
      showError('Something went wrong, please try again later');
    }
  }, [patchIsError, deleteStatus]);

  const handleCancelEdit = () => {
    if (richText !== comment?.content) showChangesAreMemorized();
    setRichText(comment?.content);
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchPostComment({ content: richText });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  return (
    <Box
      sx={theme => ({
        backgroundColor: theme.colors.blue[2],
        minHeight: 'calc(100vh - 120px)',
        padding: '120px'
      })}
    >
      {comment && (
        <Center>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
            <div style={{ maxWidth: '750px' }}>
              <Card
                sx={{
                  backgroundColor: 'white',
                  paddingTop: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginBottom: 30,
                  borderRadius: '5px'
                  // width: '750px'
                }}
                component={Link}
                to={`/posts/${comment?.post?._id}`}
                rel="noopener noreferrer"
              >
                <Group>
                  <ActionIcon>
                    <ArrowBigLeft />
                  </ActionIcon>

                  <Title sx={{ width: 'calc(100% - 50px)' }} order={4}>
                    {comment?.post?.title}
                  </Title>
                </Group>
              </Card>
              <Card
              // sx={{
              //   backgroundColor: "white",
              //   paddingTop: 40,
              //   paddingLeft: 10,
              //   paddingRight: 10,
              //   borderRadius: "5px",
              //   width: "750px",
              // }}
              >
                {comment.commenter?._id === '62d88288dcf0582d700a323f' ? (
                  <Group>
                    <Avatar
                      src={comment.commenter?.photo}
                      alt={comment.commenter?.profileName}
                      radius="xl"
                    />

                    <div>
                      <Text size="sm">{comment.commenter?.profileName}</Text>
                      <Text size="xs" color="dimmed">
                        {comment.editedAt &&
                          'deleted ' + calcTimeAgo(comment.editedAt)}
                      </Text>
                    </div>
                  </Group>
                ) : (
                  <Group>
                    <AvatarComponent
                      creator={comment?.commenter}
                      username={comment?.commenter.username}
                      profileName={comment?.commenter.profileName}
                      role={comment?.commenter.role}
                      photo={comment.commenter?.photo}
                      id={comment?.commenter._id}
                      creationId={comment?._id}
                      myId={user?.id}
                    />

                    <div>
                      <Text size="sm">{comment.commenter?.profileName}</Text>
                      <Text size="xs" color="dimmed">
                        {doneEdit
                          ? calcTimeAgo(editTime) + doneEdit
                          : comment.editedAt
                          ? calcTimeAgo(comment?.editedAt) + edited
                          : calcTimeAgo(comment?.createdAt)}
                      </Text>
                    </div>
                  </Group>
                )}

                <div className={classes.commentBody}>
                  <RichTextEditor
                    // placeholder="Post comment content"
                    // mt="md"
                    onClick={e =>
                      e.target.currentSrc &&
                      window.open(e.target.currentSrc, '_blank', 'noopener')
                    }
                    id={`postCommentContent${comment.id}`}
                    name={`postCommentContent${comment.id}`}
                    key={`postCommentContent${comment.id}`}
                    value={comment.content}
                    onChange={setRichText}
                    readOnly={readOnly || user?.id !== comment.commenter?.id}
                    sx={{
                      border: 'none',
                      fontSize: 17,
                      color: ' #343a40',
                      padding: '15px 10px'
                    }}
                  />
                  {!readOnly && user?.id === comment.commenter?.id && (
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
                  <Group sx={{ marginLeft: 20 }}>
                    {/* <Button
                      variant="subtle"
                      color="gray"
                      size="xs"
                      onClick={() => setOpenReply(!openReply)}
                    >
                      Reply
                    </Button> */}
                    <BookmarkLikeMoreIconGroups
                      itemLikes={comment.likes}
                      itemId={comment.id}
                      navigate={navigate}
                      user={user}
                      userLikedItems={user?.likedPostComments}
                      arrayMethod="PostComment"
                      patchEndPoint="postComments"
                      userBookmarkedItems={user?.bookmarkedPostComments}
                      bookmarkAddMethod="addBookmarkedPostComment"
                      bookmarkRemoveMethod="removeBookmarkedPostComment"
                      queryName={['post', comment.post?._id, 'comments']}
                      likedProperty="likedPostComments"
                      bookmarkedProperty="bookmarkedPostComments"
                      itemModel="PostComment"
                      moreMenu={
                        <CommentActionMenu
                          itemId={comment.id}
                          itemCreatorId={comment.commenter?.id}
                          setDataName={['post', comment.post?.id, 'comments']}
                          itemEndpoint="postComments"
                          userId={user?._id}
                          userItems={user?.myPostComments}
                          handleDeleteItem={handleDeletePostComment}
                          deleteStatus={deleteStatus}
                          setReadOnly={setReadOnly}
                          postOrStoryCreatorId={comment.poster}
                          postOrStoryId={comment.post?._id}
                          postOrStoryRoute="posts"
                          willNotifyCommenter={comment.willNotifyCommenter}
                          subscribers={comment.subscribers}
                        />
                      }
                    />
                  </Group>
                  <Divider my="sm" variant="dotted" />
                  <Stack align="flex-end" spacing={1}>
                    {sortedReplies?.some(el => el.replier?._id === user?.id) &&
                      (showMyReply ? (
                        <Button
                          variant="subtle"
                          color="gray"
                          size="xs"
                          compact
                          onClick={() => setShowMyReply(!showMyReply)}
                        >
                          See replies in the natural order
                        </Button>
                      ) : (
                        <Button
                          variant="subtle"
                          color="gray"
                          size="xs"
                          compact
                          onClick={() => setShowMyReply(!showMyReply)}
                        >
                          See my replies first
                        </Button>
                      ))}
                  </Stack>
                  {user &&
                    (openReply ? (
                      <PostReplyCreateForm
                        user={user}
                        postId={comment.post?.id}
                        postCommentId={comment.id}
                        setOpenReply={setOpenReply}
                        invalidatePostCommentPage={[
                          'postComment',
                          params.postCommentId
                        ]}
                      />
                    ) : (
                      <Group sx={{ padding: '40px 0 40px 16px' }}>
                        <Avatar
                          src={user?.photo}
                          alt={user?.profileName}
                          radius="xl"
                          component={Link}
                          size="md"
                          to={`/me/home`}
                        />
                        <Text
                          color="dimmed"
                          size="sm"
                          onClick={() => setOpenReply(true)}
                          sx={{
                            borderBottom: '1px gray solid',
                            width: 300,
                            paddingBottom: 2,
                            cursor: 'text'
                          }}
                        >
                          Comment here...
                        </Text>
                      </Group>
                    ))}

                  <Container sx={{ marginTop: 20 }}>
                    {(showMyReply && sortedReplies
                      ? sortedReplies
                      : comment.postReplies
                    )?.map(reply => (
                      <PostReply
                        key={reply?.id}
                        reply={reply}
                        user={user}
                        fontSize={16}
                      />
                    ))}
                  </Container>
                </div>
              </Card>
            </div>

            <PostRightStack
              user={user}
              route="posts"
              routeWithFirstLetterCapitalized="Posts"
              related={relatedAndUnresponsedPosts?.related}
              unresponsed={relatedAndUnresponsedPosts?.unresponsed}
            />
          </div>
        </Center>
      )}
    </Box>
  );
};

export default PostCommentPage;
