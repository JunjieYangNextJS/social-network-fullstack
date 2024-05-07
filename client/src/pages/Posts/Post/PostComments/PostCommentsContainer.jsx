import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Divider
} from '@mantine/core';
import { useInfiniteQuery } from 'react-query';

import PostCommentContent from './PostCommentContent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PinnedPostComment from './PinnedPostComment';
import useIntersectionObserver from './../../../../Hooks/useIntersectionObserverHook';
import backendApi from './../../../../utility/backendApi';
import useGetPostComment from '../../../../react-query-hooks/usePostComments/useGetPostComment';

const PostCommentsContainer = ({
  user,
  postComments,
  postId,
  posterProfileName,
  posterId,
  pinned,
  willNotify,
  sortByValue
}) => {
  const navigate = useNavigate();

  const limit = 10;

  const fetchPostComments = ({ pageParam = 0 }) => {
    if (pinned) {
      return axios.get(
        `${backendApi}postComments?id[ne]=${pinned}&post=${postId}&sort=${sortByValue}&limit=${limit}&page=${pageParam}`,
        {
          withCredentials: true
        }
      );
    }

    return axios.get(
      `${backendApi}postComments?post=${postId}&sort=${sortByValue}&limit=${limit}&page=${pageParam}`,
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
  } = useInfiniteQuery(
    ['post', postId, 'comments', { sort: sortByValue }],
    fetchPostComments,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.data.totalDocsInDB / limit) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
      enabled: !!postId
    }
  );

  const loadMoreRef = useRef();

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage
  });

  // get pinned
  const { data: pinnedComment } = useGetPostComment(pinned);

  // get highlighted
  const highlightedCommentString = localStorage.getItem('highlightedComment');
  const highlightedComment = postComments?.filter(
    el => el.id === highlightedCommentString
  );
  return (
    <>
      <Container>
        {highlightedComment && (
          <Paper sx={{ color: 'red' }}>{highlightedComment[0]?.content}</Paper>
        )}
        {pinnedComment && (
          <PinnedPostComment
            postComment={pinnedComment}
            user={user}
            navigate={navigate}
            posterId={posterId}
            posterProfileName={posterProfileName}
            postId={postId}
            pinned={pinned}
            willNotify={willNotify}
          />
        )}
        <Stack
          spacing={3}
          // divider={<Divider orientation="horizontal" flexItem />}
        >
          <div>
            {data &&
              data.pages &&
              data.pages.map((group, index) => {
                return (
                  <Fragment key={index}>
                    {user
                      ? group?.data.data.data
                          ?.filter(
                            comment =>
                              !user?.blockedUsers.includes(
                                comment?.commenter?.id
                              )
                          )

                          ?.map(postComment => {
                            return (
                              <PostCommentContent
                                postComment={postComment}
                                key={postComment?.id}
                                oldPagesArray={data}
                                user={user}
                                navigate={navigate}
                                refetch={refetch}
                                index={index}
                                posterId={posterId}
                                postId={postId}
                                pinned={pinned}
                                willNotify={willNotify}
                              />
                            );
                          })
                      : group?.data.data.data?.map(postComment => {
                          return (
                            <PostCommentContent
                              postComment={postComment}
                              key={postComment?.id}
                              oldPagesArray={data}
                              user={user}
                              navigate={navigate}
                              refetch={refetch}
                              index={index}
                              posterId={posterId}
                              postId={postId}
                              pinned={pinned}
                              willNotify={willNotify}
                            />
                          );
                        })}
                  </Fragment>
                );
              })}
          </div>
          <div
            ref={loadMoreRef}
            style={{
              visibility: !hasNextPage ? 'hidden' : 'default',
              height: 10
            }}
          >
            {isFetchingNextPage ? 'Loading more...' : ''}
          </div>
        </Stack>
      </Container>
    </>
  );
};

export default PostCommentsContainer;
