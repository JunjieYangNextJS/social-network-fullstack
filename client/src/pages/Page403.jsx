import React from 'react';
import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Group
} from '@mantine/core';
import { Link } from 'react-router-dom';

const useStyles = createStyles(theme => ({
  root: {
    paddingTop: 150,
    paddingBottom: 80
  },

  inner: {
    position: 'relative'
  },

  content: {
    paddingTop: 220,
    position: 'relative',
    zIndex: 1,

    [theme.fn.smallerThan('sm')]: {
      paddingTop: 120
    }
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32
    }
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5
  }
}));

export default function Page403({ message }) {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>403 Forbidden Error</Title>
          <Text
            color="dimmed"
            size="lg"
            align="center"
            className={classes.description}
          >
            {message}
          </Text>
          <Group position="center">
            <Button component={Link} to="/" size="md">
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
