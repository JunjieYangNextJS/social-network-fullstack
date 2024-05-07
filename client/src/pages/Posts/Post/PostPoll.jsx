import { Progress, createStyles, Group, Box, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';

import { usePatchPostVotes } from '../../../react-query-hooks/usePosts/usePatchPost';
import { useQueryClient } from 'react-query';
import calcTimeAgo from '../../../utility/calcTimeAgo';
import { useNavigate } from 'react-router-dom';

const useStyles = createStyles(theme => ({
  progress: {
    height: '35px'
  },

  label: {
    width: '50px'
  }
}));

export default function PostPoll({ poll, myVotes, postId, pollEndsAt }) {
  const { classes } = useStyles();
  const [voted, setVoted] = useState('');

  const { mutate: patchPostVotes } = usePatchPostVotes(postId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (poll.some(el => myVotes?.includes(el._id))) {
      setVoted(poll.find(el => myVotes?.includes(el._id))?._id);
    }
  }, [myVotes, poll]);

  const totalVotes = poll.reduce((n, { votes }) => n + votes, 0);

  const handleVote = async id => {
    if (Date.parse(pollEndsAt) < Date.now()) return;
    if (!myVotes) return navigate('/login');

    if (voted === id) {
      patchPostVotes({ post: postId, removeId: voted });
      setVoted('');

      const newMyVotes = myVotes.filter(el => el !== voted);

      await queryClient.cancelQueries(['user']);
      queryClient.setQueryData(['user'], old => ({
        ...old,
        myVotes: newMyVotes
      }));
    } else {
      patchPostVotes({ post: postId, removeId: voted, addId: id });
      setVoted(id);

      const newMyVotes = myVotes.filter(el => el !== voted);
      newMyVotes.push(id);

      await queryClient.cancelQueries(['user']);
      queryClient.setQueryData(['user'], old => ({
        ...old,
        myVotes: newMyVotes
      }));
    }
  };

  return (
    <div style={{ margin: '15px 0' }}>
      <Group position="right">
        <Text size="sm">{totalVotes} people voted</Text>
      </Group>
      {voted ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '3px'
          }}
        >
          {poll.map(el => (
            <div
              key={el._id}
              style={{
                position: 'relative',
                cursor:
                  Date.parse(pollEndsAt) < Date.now() ? 'default' : 'pointer'
              }}
              onClick={() => handleVote(el._id)}
            >
              <Progress
                className={classes.progress}
                color={voted === el._id ? '#A5D8FF' : '#DBE4FF'}
                value={Math.round((el.votes / totalVotes) * 100)}
                size={24}
                radius="xs"
              />
              <Text
                color="black"
                weight="500"
                sx={{ position: 'absolute', zIndex: 99, top: 5, left: 15 }}
              >
                {el.label}: {Math.round((el.votes / totalVotes) * 100) || 0}%
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '3px'
          }}
        >
          {poll.map(el => (
            <div
              key={el._id}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => handleVote(el._id)}
            >
              <Progress
                className={classes.progress}
                color={'#DBE4FF'}
                value={0}
                size={24}
                radius="xs"
              />
              <Text
                color="black"
                weight="500"
                sx={{ position: 'absolute', zIndex: 99, top: 5, left: 15 }}
              >
                {el.label}
              </Text>
            </div>
          ))}
        </div>
      )}
      <Group position="right">
        <Text size="sm">Voting ends {calcTimeAgo(pollEndsAt)}</Text>
      </Group>
    </div>
  );
}
