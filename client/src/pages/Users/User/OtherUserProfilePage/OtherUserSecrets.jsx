import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import backendApi from './../../../../utility/backendApi';
import SecretCard from './../../../../components/Cards/SecretCard';
import { Container } from '@mantine/core';
import useIntersectionObserver from './../../../../Hooks/useIntersectionObserverHook';

export default function OtherUserSecrets({ otherUser, user }) {
  const limit = 5;

  const fetchUserSecrets = ({ pageParam = 0 }) => {
    return axios.get(
      `${backendApi}secrets/secretTeller/${
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
    refetch
  } = useInfiniteQuery(['secrets', otherUser?.id], fetchUserSecrets, {
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
    refetch();
  }, [refetch]);

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
                    post => !user?.blockedUsers.includes(post?.secretTeller?.id)
                  )
                  ?.filter(post => !user?.hiddenSecrets.includes(post?._id))

                  ?.map(post => {
                    const {
                      content,
                      title,
                      secretTeller,
                      images,
                      createdAt,
                      _id,
                      likes,
                      reports,
                      viewCount
                    } = post;
                    return (
                      <SecretCard
                        key={_id}
                        user={user}
                        userBookmarks={user?.bookmarks}
                        postId={_id}
                        content={content}
                        title={title}
                        likes={likes}
                        reports={reports}
                        images={images}
                        createdAt={createdAt}
                        secretTellerPhoto={secretTeller?.photo}
                        secretTellerUsername={secretTeller?.username}
                        secretTellerProfileName={secretTeller?.profileName}
                        secretTellerId={secretTeller?._id}
                        refetch={refetch}
                        pageIndex={index}
                        oldPagesArray={data}
                      />
                    );
                  })
              : group?.data.data.data?.map(post => {
                  const {
                    content,
                    title,
                    secretTeller,
                    images,
                    createdAt,
                    _id,
                    likes,
                    reports,
                    viewCount
                  } = post;
                  return (
                    <SecretCard
                      key={_id}
                      user={user}
                      userBookmarks={user?.bookmarks}
                      postId={_id}
                      content={content}
                      title={title}
                      likes={likes}
                      reports={reports}
                      viewCount={viewCount}
                      images={images}
                      createdAt={createdAt}
                      secretTellerPhoto={secretTeller?.photo}
                      secretTellerUsername={secretTeller?.username}
                      secretTellerId={secretTeller?._id}
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
