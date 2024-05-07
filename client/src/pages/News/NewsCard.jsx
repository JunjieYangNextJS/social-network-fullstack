import React from 'react';
import { createStyles, Card, Image, Avatar, Text, Group } from '@mantine/core';
import calcTimeAgo from './../../utility/calcTimeAgo';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    cursor: 'pointer'
  },

  title: {
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.2
  },

  body: {
    padding: theme.spacing.md
  }
}));

export default function NewsCard({ news, imageless }) {
  const {
    content,
    title,
    authorName,
    about,
    link,
    createdAt,
    id,
    image
  } = news;
  const { classes } = useStyles();

  return (
    <Card
      withBorder
      radius="md"
      p={0}
      className={classes.card}
      shadow="xl"
      onClick={() => window.open(link, '_blank')?.focus()}
    >
      <Group noWrap spacing={0}>
        {!imageless && image && (
          <Image
            src={image}
            height={140}
            width={140}
            radius={5}
            sx={{ marginLeft: 5 }}
          />
        )}
        <div className={classes.body}>
          <Text transform="uppercase" color="dimmed" weight={700} size="xs">
            {about}
          </Text>
          <Text className={classes.title} mt="xs" mb="md">
            {title}
          </Text>
          <Group noWrap spacing="xs">
            <Group spacing="xs" noWrap>
              <Text size="xs">by {authorName}</Text>
            </Group>
            <Text size="xs" color="dimmed">
              •
            </Text>
            <Text size="xs" color="dimmed">
              {calcTimeAgo(createdAt)}
            </Text>
          </Group>
        </div>
      </Group>
    </Card>
  );
}
