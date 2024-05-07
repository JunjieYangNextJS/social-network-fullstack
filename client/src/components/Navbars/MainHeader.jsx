import React, { useState } from 'react';
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Image,
  Menu,
  Text,
  Avatar,
  UnstyledButton,
  Divider,
  Anchor
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

import { useBooleanToggle } from '@mantine/hooks';
import axios from 'axios';
import backendApi from './../../utility/backendApi';

import { useQueryClient } from 'react-query';
import {
  Logout,
  Settings,
  ChevronDown,
  FileText,
  License,
  ChristmasTree,
  BellRinging,
  Home
} from 'tabler-icons-react';

import WillNotifyNotificationsIconButton from './../IconButtons/WillNotifyNotificationsIconButton';

const HEADER_HEIGHT = 60;

const useStyles = createStyles(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    zIndex: 200
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md
    }
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7]
    }
  }
}));

export default function MainHeader({ user }) {
  const { classes, cx, theme } = useStyles();
  const sections = [
    {
      label: 'Forum',
      link: 'posts'
    },
    {
      label: 'Stories',
      link: 'stories'
    },
    {
      label: 'Tree Hollow',
      link: 'tree-hollow'
    },
    {
      label: 'News',
      link: 'news'
    }
  ];

  const creations = [
    {
      label: 'My posts',
      link: 'my-posts',
      icon: <FileText size={14} color={theme.colors.blue[6]} />
    },
    {
      label: 'My stories',
      link: 'my-stories',
      icon: <License size={14} color={theme.colors.grape[9]} />
    },
    {
      label: 'My voices',
      link: 'my-voices',
      icon: <ChristmasTree size={14} color={theme.colors.green[6]} />
    }
  ];

  const account = [
    {
      label: 'Home',
      link: 'home',
      icon: <Home size={14} color={theme.colors.green[6]} />
    },
    {
      label: 'Notifications',
      link: 'notifications',
      icon: <BellRinging size={14} color={theme.colors.orange[5]} />
    },
    {
      label: 'Settings',
      link: 'privacy',
      icon: <Settings size={14} color={theme.colors.orange[5]} />
    }
  ];

  const urlParts = window.location.href.split('/');

  const last = urlParts[urlParts.length - 1] || 'posts';

  const [opened, toggleOpened] = useBooleanToggle(false);

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${backendApi}users/logout`, {
        withCredentials: true
      });
      if ((res.data.status = 'success')) {
        queryClient.removeQueries(['user', { exact: true }]);
        window.location.reload();
      }
    } catch (err) {
      alert('logout was unsuccessful');
    }
  };

  const items = sections.map(link => (
    <div
      key={link.label}
      className={classes.link}
      style={{
        backgroundColor:
          link.link === last && theme.colors[theme.primaryColor][0],
        color: link.link === last && theme.colors[theme.primaryColor][7]
      }}
      onClick={() => {
        navigate(`/${link.link}`);

        toggleOpened(false);
      }}
    >
      {link.label}
    </div>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Group
          spacing={0}
          align="flex-end"
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            navigate(`/posts`);

            toggleOpened(false);
          }}
        >
          <Image src={'/logo.jpg'} alt="logo" height={32} />
          <Text size="md" weight="600">
            Pri
            <Text color="red" component="span">
              D
            </Text>
            ers
          </Text>
        </Group>

        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        {user ? (
          <Group>
            <WillNotifyNotificationsIconButton user={user} />
            <Menu
              size={160}
              placement="end"
              transition="pop-top-right"
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              control={
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={user.photo}
                      alt="User photo"
                      radius="xl"
                      size={25}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.profileName}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              }
            >
              {account.map(({ label, link, icon }) => (
                <Menu.Item
                  key={label}
                  component={Link}
                  to={`/me/${link}`}
                  icon={icon}
                >
                  {label}
                </Menu.Item>
              ))}
              <Menu.Label>Creations</Menu.Label>
              {creations.map(({ label, link, icon }) => (
                <Menu.Item
                  key={label}
                  component={Link}
                  to={`/me/${link}`}
                  icon={icon}
                >
                  {label}
                </Menu.Item>
              ))}

              <Divider />

              <Menu.Item
                onClick={() => handleLogout()}
                icon={<Logout size={14} />}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Group>
        ) : (
          <Anchor component={Link} to={'/login'}>
            Login
          </Anchor>
        )}
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {styles => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
