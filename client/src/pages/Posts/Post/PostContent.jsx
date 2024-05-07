import React, { useEffect, useState } from 'react';
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  TextInput,
  Stack,
  Button,
  Title,
  Indicator,
  Center,
  Loader,
  Menu
} from '@mantine/core';
import calcTimeAgo from './../../../utility/calcTimeAgo';
import PostStoryActionMenu from './../../../components/Menus/PostStoryActionMenu';
import BookmarkLikeMoreIconGroups from './../../../components/IconGroups/BookmarkLikeMoreIconGroups';
import useDeletePost from './../../../react-query-hooks/usePosts/useDeletePost';
import RichTextEditor from '@mantine/rte';
import ViewCountIconButton from './../../../components/IconButtons/ViewCountIconButton';
import CommentsCountIconButton from './../../../components/IconButtons/CommentsCountIconButton';

import usePatchPost from './../../../react-query-hooks/usePosts/usePatchPost';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import { useGetHoverOtherUser } from '../../../react-query-hooks/useOtherUsers/useOtherUser';
import { Link } from 'react-router-dom';
import PostPoll from './PostPoll';
import AvatarComponent from '../../../components/AvatarComponent';
import { showChangesAreMemorized } from '../../../utility/showNotifications';

const PostContent = ({ post, user, navigate }) => {
  const { mutate: handleDeletePost, status: deleteStatus } = useDeletePost();
  const {
    mutate: patchPost,
    isLoading: patchIsLoading,
    isSuccess: isPatchSuccess
  } = usePatchPost(post?.id);

  const edited = ' (edited)';

  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richTextContent, setRichTextContent] = useState('');
  const [richTextTitle, setRichTextTitle] = useState('');

  useEffect(() => {
    setRichTextContent(post?.content);
    setRichTextTitle(post?.title);
  }, [post?.content, post?.title]);

  useDidUpdate(() => {
    if (isPatchSuccess)
      showNotification({
        title: 'Awesome',
        message: 'Your post has been updated!',
        color: 'teal',
        icon: <Check />,
        autoClose: 5000
      });
  }, [isPatchSuccess]);

  const handleCancelEdit = () => {
    setRichTextContent(post?.content);
    setRichTextTitle(post?.title);
    setReadOnly(true);
    if (richTextContent !== post?.content) showChangesAreMemorized();
  };

  const handleConfirmEdit = () => {
    patchPost({
      content: richTextContent,
      title: richTextTitle,
      editedAt: Date.now()
    });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  return (
    <>
      {post && (
        <Container>
          <Center sx={{ paddingBottom: 20 }}>
            {!readOnly && user?.id === post?.poster.id ? (
              <TextInput
                value={richTextTitle}
                onChange={event => setRichTextTitle(event.currentTarget.value)}
                id={`postTitle${post?.id}`}
                name={`postTitle${post?.id}`}
                sx={{ width: 400 }}
              />
            ) : (
              <Title
                sx={theme => ({
                  color: theme.colors.black[0],
                  padding: '0 50px 5px 50px',
                  fontSize: 23
                })}
                order={1}
              >
                {richTextTitle}
              </Title>
            )}
          </Center>

          <Group>
            <AvatarComponent
              creator={post?.poster}
              username={post?.poster.username}
              profileName={post?.poster.profileName}
              role={post?.poster.role}
              photo={post?.poster.photo}
              id={post?.poster._id}
              creationId={post?._id}
              myId={user?.id}
            />

            <div>
              <Text size="sm">{post?.poster.profileName}</Text>
              <Text size="xs" color="dimmed">
                {doneEdit
                  ? calcTimeAgo(editTime) + doneEdit
                  : post?.editedAt
                  ? calcTimeAgo(post?.editedAt) + edited
                  : calcTimeAgo(post?.createdAt)}
              </Text>
            </div>
          </Group>
          <RichTextEditor
            placeholder="[ No content ]"
            onClick={e =>
              e.target.currentSrc &&
              window.open(e.target.currentSrc, '_blank', 'noopener')
            }
            id={`postContent${post?.id}`}
            name={`postContent${post?.id}`}
            key={`postContent${post?.id}`}
            value={post?.content}
            onChange={setRichTextContent}
            readOnly={readOnly || user?.id !== post?.poster.id}
            sx={theme => ({
              border: 'none',
              fontSize: 16,
              color: theme.colors.black[0],
              margin: '5px 0 5px 0'
              // height: 80,
            })}
          />
          {!readOnly && user?.id === post?.poster.id && (
            <Group spacing="xs" sx={{ marginBottom: 10 }}>
              <Button
                variant="light"
                color="gray"
                size="xs"
                disabled={isRichTextEmpty(richTextTitle) || patchIsLoading}
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
          {post && post.poll && post.poll.length >= 2 && (
            <PostPoll
              poll={post.poll}
              pollEndsAt={post.pollEndsAt}
              myVotes={user?.myVotes}
              postId={post._id}
            />
          )}
          <BookmarkLikeMoreIconGroups
            itemLikes={post?.likes}
            itemId={post?._id}
            navigate={navigate}
            user={user}
            arrayMethod="Post"
            patchEndPoint="posts"
            single="post"
            userBookmarkedItems={user?.bookmarkedPosts}
            bookmarkAddMethod="addBookmarkedPost"
            bookmarkRemoveMethod="removeBookmarkedPost"
            userLikedItems={user?.likedPosts}
            queryName={['post', post._id]}
            likedProperty="likedPosts"
            bookmarkedProperty="bookmarkedPosts"
            itemModel="Post"
            moreMenu={
              <>
                <CommentsCountIconButton commentsCount={post?.commentCount} />
                <PostStoryActionMenu
                  itemCreatorId={post?.poster.id}
                  itemId={post?._id}
                  willNotify={post?.willNotify}
                  subscribers={post?.subscribers}
                  itemEndpoint="posts"
                  userId={user?._id}
                  userItems={user?.myPosts}
                  handleDeleteItem={handleDeletePost}
                  deleteStatus={deleteStatus}
                  navigateToOrigin={true}
                  setReadOnly={setReadOnly}
                />
              </>
            }
          />
        </Container>
      )}
    </>
  );
};

export default PostContent;

//
