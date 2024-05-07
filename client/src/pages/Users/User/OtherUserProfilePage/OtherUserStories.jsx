import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../../../utility/backendApi';
import StoryCard from './../../../../components/Cards/StoryCard';
import { Container } from '@mantine/core';
import useIntersectionObserver from './../../../../Hooks/useIntersectionObserverHook';

export default function OtherUserStories({ otherUser, user }) {
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchUserStories = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}stories/storyteller/${
        otherUser?.id
      }?limit=5&page=${pageParam}`,
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
    error,
    isFetching,
    refetch
  } = useInfiniteQuery(['stories', otherUser?.id], fetchUserStories, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < 20) {
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
                    story =>
                      !user?.blockedUsers.includes(story?.storyTeller?.id)
                  )
                  ?.filter(story => !user?.hiddenStories.includes(story?._id))

                  ?.map(story => {
                    const {
                      content,
                      title,
                      storyTeller,
                      images,
                      createdAt,
                      _id,
                      likes,

                      reports,
                      viewCount
                    } = story;
                    return (
                      <StoryCard
                        key={_id}
                        user={user}
                        userBookmarks={user?.bookmarks}
                        storyId={_id}
                        content={content}
                        title={title}
                        likes={likes}
                        reports={reports}
                        viewCount={viewCount}
                        images={images}
                        createdAt={createdAt}
                        storyTellerPhoto={storyTeller?.photo}
                        storyTellerUsername={storyTeller?.username}
                        storyTellerProfileName={storyTeller?.profileName}
                        storyTellerId={storyTeller?._id}
                        refetch={refetch}
                        pageIndex={index}
                        oldPagesArray={data}
                      />
                    );
                  })
              : group?.data.data.data?.map(story => {
                  const {
                    content,
                    title,
                    storyTeller,
                    images,
                    createdAt,
                    _id,
                    likes,
                    reports,
                    viewCount
                  } = story;
                  return (
                    <StoryCard
                      key={_id}
                      user={user}
                      userBookmarks={user?.bookmarks}
                      storyId={_id}
                      content={content}
                      title={title}
                      likes={likes}
                      reports={reports}
                      viewCount={viewCount}
                      images={images}
                      createdAt={createdAt}
                      storyTellerPhoto={storyTeller?.photo}
                      storyTellerUsername={storyTeller?.username}
                      storyTellerId={storyTeller?._id}
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
        {!errorMessage && (isFetchingNextPage ? 'Loading more...' : '')}
      </div>
    </Container>
  );
}
