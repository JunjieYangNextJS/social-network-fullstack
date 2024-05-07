import React, { useState, useEffect } from 'react';
import { createStyles, Card, Group, Switch, Text, Select } from '@mantine/core';
import { getSelectConfigs, getSwitchConfigs } from './ConfigsData';
import { useDidUpdate } from '@mantine/hooks';
import { usePatchUserWithoutPhoto } from './../../react-query-hooks/useUser/usePatchUser';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },

  item: {
    '& + &': {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`
    }
  },

  switch: {
    '& *': {
      cursor: 'pointer'
    }
  },

  title: {
    lineHeight: 1
  }
}));

export default function PrivacyCard({ user }) {
  const { classes } = useStyles();
  const [messageConfig, setMessageConfig] = useState(user.whoCanMessageMe);
  const [postsConfig, setPostsConfig] = useState(user.postsExposedTo);
  const [storiesConfig, setStoriesConfig] = useState(user.storiesExposedTo);
  const [secretsConfig, setSecretsConfig] = useState(user.secretsExposedTo);
  const [allowFollowingConfig, setAllowFollowingConfig] = useState(
    user.allowFollowing
  );
  const [allowFriendingConfig, setAllowFriendingConfig] = useState(
    user.allowFriending
  );

  const { mutate } = usePatchUserWithoutPhoto();

  useDidUpdate(() => {
    console.log('run when state changes, not when component mounts');
    mutate({ whoCanMessageMe: messageConfig });
  }, [messageConfig, mutate]);

  useDidUpdate(() => {
    mutate({ postsExposedTo: postsConfig });
  }, [postsConfig, mutate]);

  useDidUpdate(() => {
    mutate({ storiesExposedTo: storiesConfig });
  }, [storiesConfig, mutate]);

  useDidUpdate(() => {
    mutate({ secretsExposedTo: secretsConfig });
  }, [secretsConfig, mutate]);

  useDidUpdate(() => {
    mutate({ allowFollowing: allowFollowingConfig });
  }, [allowFollowingConfig, mutate]);

  useDidUpdate(() => {
    mutate({ allowFriending: allowFriendingConfig });
  }, [allowFriendingConfig, mutate]);

  // useDidUpdate(() => {
  //   mutate({ allowChatting: allowChattingConfig });
  // }, [allowChattingConfig, mutate]);

  const selectsConfigs = getSelectConfigs(
    messageConfig,
    setMessageConfig,
    postsConfig,
    setPostsConfig,
    storiesConfig,
    setStoriesConfig,
    secretsConfig,
    setSecretsConfig
  );

  const switchesConfigs = getSwitchConfigs(
    allowFollowingConfig,
    setAllowFollowingConfig,
    allowFriendingConfig,
    setAllowFriendingConfig
  );

  const selects = selectsConfigs.map(
    ({ title, description, value, onChange, selectData }) => (
      <Group
        position="apart"
        className={classes.item}
        noWrap
        spacing="xl"
        key={title}
      >
        <div>
          <Text>{title}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>

        {selectData && (
          <Select
            value={value}
            onChange={onChange}
            data={selectData}
            key={title}
          />
        )}
      </Group>
    )
  );

  const switches = switchesConfigs.map(
    ({ title, description, checked, onChange }) => (
      <Group
        position="apart"
        className={classes.item}
        noWrap
        spacing="xl"
        key={title}
      >
        <div>
          <Text>{title}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          className={classes.switch}
          size="lg"
          checked={checked}
          onChange={onChange}
        />
      </Group>
    )
  );

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Text size="lg" className={classes.title} weight={500}>
        {/* {title} */}
      </Text>
      <Text size="xs" color="dimmed" mt={3} mb="xl">
        {/* {description} */}
      </Text>
      {selects}
      {switches}
    </Card>
  );
}
