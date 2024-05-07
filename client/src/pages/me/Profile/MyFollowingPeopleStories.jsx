import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../../utility/backendApi';
import StoryCard from './../../../components/Cards/StoryCard';
import { Container } from '@mantine/core';
import useIntersectionObserver from './../../../Hooks/useIntersectionObserverHook';

export default function MyFollowingPeopleStories({ user }) {
  const limit = 5;

  const fetchStories = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}users/getMyFollowingPeopleStories?limit=${limit}&page=${pageParam}`,
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
  } = useInfiniteQuery(['myFollowingPeopleStories'], fetchStories, {
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.data.totalDocsInDB / limit) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
    enabled: !!user
  });

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  return (
    <Container>
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
                      lastCommentedAt,
                      _id,
                      likes,
                      commentCount
                    } = story;

                    return (
                      <StoryCard
                        key={_id}
                        user={user}
                        storyId={_id}
                        content={content}
                        title={title}
                        likes={likes}
                        commentCount={commentCount}
                        images={images}
                        createdAt={createdAt}
                        lastCommentedAt={lastCommentedAt}
                        storyTeller={storyTeller}
                        storyTellerPhoto={storyTeller?.photo}
                        storyTellerUsername={storyTeller?.username}
                        storyTellerProfileName={storyTeller?.profileName}
                        storyTellerId={storyTeller?._id}
                        storyTellerRole={storyTeller?.role}
                        refetch={refetch}
                        pageIndex={index}
                        oldPagesArray={data}
                        withBorder={true}
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
                    lastCommentedAt,
                    _id,
                    likes,
                    commentCount
                  } = story;
                  return (
                    <StoryCard
                      key={_id}
                      user={user}
                      storyId={_id}
                      content={content}
                      title={title}
                      likes={likes}
                      commentCount={commentCount}
                      images={images}
                      createdAt={createdAt}
                      lastCommentedAt={lastCommentedAt}
                      storyTeller={storyTeller}
                      storyTellerPhoto={storyTeller?.photo}
                      storyTellerUsername={storyTeller?.username}
                      storyTellerProfileName={storyTeller?.profileName}
                      storyTellerId={storyTeller?._id}
                      storyTellerRole={storyTeller?.role}
                      refetch={refetch}
                      pageIndex={index}
                      oldPagesArray={data}
                      withBorder={true}
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
