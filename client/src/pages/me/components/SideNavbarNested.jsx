import React from 'react';
import { Navbar, ScrollArea, createStyles } from '@mantine/core';
import {
  Notes,
  Home,
  Writing,
  Friends,
  Heart,
  LockOff,
  Settings,
  Bookmark,
  BellRinging
} from 'tabler-icons-react';
import LinksGroup from '../../../components/Navbars/LinksGroup';

const navbarData = [
  { label: 'Home', icon: Home, outerLink: '/me/home' },
  {
    label: 'My creations',
    icon: Writing,

    links: [
      { label: 'Posts', link: '/me/my-posts' },
      { label: 'Stories', link: '/me/my-stories' },
      { label: 'Voices', link: '/me/my-voices' }
    ]
  },
  {
    label: 'My comments',
    icon: Notes,

    links: [
      { label: 'Post-comments', link: '/me/my-post-comments' },
      { label: 'Post-replies', link: '/me/my-post-replies' },
      { label: 'Story-comments', link: '/me/my-story-comments' },
      { label: 'Story-replies', link: '/me/my-story-replies' }
    ]
  },
  {
    label: 'Notifications',
    icon: BellRinging,
    outerLink: '/me/notifications'
  },
  {
    label: 'Friend list',
    icon: Friends,
    outerLink: '/me/friend-list'
  },
  {
    label: 'Bookmarked',
    icon: Bookmark,
    links: [
      { label: 'Posts', link: '/me/bookmarked-posts' },
      { label: 'Post-comments', link: '/me/bookmarked-post-comments' },
      { label: 'Stories', link: '/me/bookmarked-stories' },
      { label: 'Story-comments', link: '/me/bookmarked-story-comments' }
    ]
  },
  {
    label: 'Liked',
    icon: Heart,
    links: [
      { label: 'Posts', link: '/me/liked-posts' },
      { label: 'Post-comments', link: '/me/liked-post-comments' },
      { label: 'Post-replies', link: '/me/liked-post-replies' },
      { label: 'Stories', link: '/me/liked-stories' },
      { label: 'Story-comments', link: '/me/liked-story-comments' },
      { label: 'Story-replies', link: '/me/liked-story-replies' }
    ]
  },
  {
    label: 'Hidden',
    icon: LockOff,
    links: [
      { label: 'Users', link: '/me/blocked-users' },
      { label: 'Posts', link: '/me/hidden-posts' },
      { label: 'Stories', link: '/me/hidden-stories' },
      { label: 'Voices', link: '/me/hidden-voices' }
    ]
  },

  {
    label: 'Settings',
    icon: Settings,
    links: [
      { label: 'Privacy', link: '/me/privacy' },
      { label: 'Change my username', link: '/me/change-my-username' },
      { label: 'Change my password', link: '/me/change-my-password' },
      { label: 'Change my email', link: '/me/change-my-email' },
      { label: 'Change my birthday', link: '/me/change-my-birthday' },
      { label: 'Delete my account', link: '/me/delete-my-account' }
    ]
  }
];

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    position: 'fixed',
    left: 0
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`
  }
}));

export default function SideNavbarNested() {
  const { classes } = useStyles();

  const links = navbarData.map(item => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <Navbar
      height={'100%'}
      width={{ base: 300 }}
      p="md"
      className={classes.navbar}
    >
      <Navbar.Section grow className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>{links}</div>
      </Navbar.Section>
    </Navbar>
  );
}
