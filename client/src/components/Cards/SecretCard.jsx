import React, { useState, useEffect } from 'react';
import {
  createStyles,
  Card,
  Image,
  ActionIcon,
  Group,
  Text,
  Avatar,
  Badge,
  Title,
  Indicator,
  Menu,
  Center,
  Loader,
  Stack
} from '@mantine/core';
import { Heart, Bookmark, Share } from 'tabler-icons-react';
import calcTimeAgo from './../../utility/calcTimeAgo';
import { useQueryClient } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    cursor: 'pointer',
    // overflow: "hidden",

    transition: 'transform 100ms ease, box-shadow 100ms ease',
    // padding: theme.spacing.xl,
    // paddingLeft: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl,
    maxWidth: '600px',
    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'scale(1.01)'
    }

    // "&::before": {
    //   content: '""',
    //   position: "absolute",
    //   top: 0,
    //   bottom: 0,
    //   left: 0,
    //   width: 6,
    //   backgroundImage: theme.fn.linearGradient(
    //     0,
    //     theme.colors.pink[6],
    //     theme.colors.orange[6]
    //   ),
    // },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.dark[6],
    padding: 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  footer: {
    padding: `0 ${theme.spacing.lg}px ${theme.spacing.xs}px ${
      theme.spacing.lg
    }px`,
    marginTop: theme.spacing.md
  }
}));

export default function SecretCard({ user, secret }) {
  const { classes, theme } = useStyles();

  const { content, expiredAt, _id: secretId, tempUsername } = secret;

  // const navigate = useNavigate();

  // const navigateToSecretId = () => {
  //   navigate(`/tree-hollow/${secretId}`);
  // };

  return (
    <Card
      radius="sm"
      className={classes.card}
      component={Link}
      to={`/tree-hollow/${secretId}`}
      // onClick={() => navigateToSecretId()}
    >
      <Stack
        justify="space-between"
        sx={{
          padding: '0px 10px',

          width: 400
        }}
      >
        <div
          style={{
            margin: '10px 5px 0 5px',

            minHeight: 50,
            maxHeight: 170,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <Text size="md">{content}</Text>
        </div>

        <Group spacing="xl">
          <Group spacing={1}>
            <Text size="sm">by</Text>
            <Text
              size="sm"
              sx={{ fontStyle: 'italic', marginLeft: 5, color: 'black' }}
            >
              {tempUsername}
            </Text>
          </Group>
          <Text color="dimmed" size="sm">
            {Date.parse(expiredAt) > Date.now() ? 'expires' : 'expired'}{' '}
            {calcTimeAgo(expiredAt)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
