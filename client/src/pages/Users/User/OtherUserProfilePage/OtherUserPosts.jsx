import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../../../utility/backendApi';
import PostCard from './../../../../components/Cards/PostCard';
import { Container } from '@mantine/core';
import useIntersectionObserver from './../../../../Hooks/useIntersectionObserverHook';

export default function OtherUserPosts({ otherUser, user }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const limit = 5;

  const fetchUserPosts = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}posts/poster/${
        otherUser?.id
      }?limit=${limit}&page=${pageParam}`,
      {
        withCredentials: true
      }
    );
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
    isSuccess,
    error,
    isError,
    refetch
  } = useInfiniteQuery(['posts', otherUser?.id], fetchUserPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.data.totalDocsInDB / limit) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
    enabled: !!otherUser?.id
  });

  useEffect(() => {
    setErrorMessage(
      error?.response.data.message || error?.response.data.error.message || null
    );
  }, [error]);

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  return (
    <Container>
      {errorMessage && <div>{errorMessage}</div>}
      {data?.pages.map((group, index) => {
        return (
          <Fragment key={index}>
            {user
              ? group?.data.data.data
                  ?.filter(
                    post => !user?.blockedUsers?.includes(post?.poster?.id)
                  )
                  ?.filter(post => !user?.hiddenPosts?.includes(post?._id))

                  ?.map(post => {
                    const {
                      content,
                      title,
                      poll,
                      poster,
                      images,
                      createdAt,
                      lastCommentedAt,
                      _id,
                      likes,
                      commentCount
                    } = post;
                    return (
                      <PostCard
                        key={_id}
                        user={user}
                        postId={_id}
                        content={content}
                        poll={poll}
                        title={title}
                        likes={likes}
                        commentCount={commentCount}
                        images={images}
                        createdAt={createdAt}
                        lastCommentedAt={lastCommentedAt}
                        poster={poster}
                        posterPhoto={poster?.photo}
                        posterUsername={poster?.username}
                        posterProfileName={poster?.profileName}
                        posterId={poster?._id}
                        posterRole={poster?.role}
                        refetch={refetch}
                        pageIndex={index}
                        oldPagesArray={data}
                        withBorder={true}
                        noHoverCard={true}
                      />
                    );
                  })
              : group?.data.data.data?.map(post => {
                  const {
                    content,
                    title,
                    poster,
                    images,
                    createdAt,
                    lastCommentedAt,
                    _id,
                    likes,
                    commentCount
                  } = post;
                  return (
                    <PostCard
                      key={_id}
                      postId={_id}
                      content={content}
                      title={title}
                      likes={likes}
                      commentCount={commentCount}
                      images={images}
                      createdAt={createdAt}
                      lastCommentedAt={lastCommentedAt}
                      poster={poster}
                      posterPhoto={poster?.photo}
                      posterUsername={poster?.username}
                      posterProfileName={poster?.profileName}
                      posterId={poster?._id}
                      posterRole={poster?.role}
                      refetch={refetch}
                      pageIndex={index}
                      oldPagesArray={data}
                      withBorder={true}
                      noHoverCard={true}
                    />
                  );
                })}
          </Fragment>
        );
      })}
      <div
        ref={loadMoreRef}
        sx={{ visibility: !hasNextPage ? 'hidden' : 'default' }}
      >
        {isFetchingNextPage ? 'Loading more...' : ''}
      </div>
    </Container>
  );
}
