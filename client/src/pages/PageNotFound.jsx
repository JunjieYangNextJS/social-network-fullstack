import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid
} from '@mantine/core';
import image from './../images/image.svg';
import { focusManager } from 'react-query';

const PageNotFound = () => {
  const useStyles = createStyles(theme => ({
    root: {
      paddingTop: 150,
      paddingBottom: 80
    },

    title: {
      fontWeight: 900,
      fontSize: 34,
      marginBottom: theme.spacing.md,
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,

      [theme.fn.smallerThan('sm')]: {
        fontSize: 32
      }
    },

    control: {
      [theme.fn.smallerThan('sm')]: {
        width: '100%'
      }
    },

    mobileImage: {
      [theme.fn.largerThan('sm')]: {
        display: 'none'
      }
    },

    desktopImage: {
      [theme.fn.smallerThan('sm')]: {
        display: 'none'
      }
    }
  }));

  const { classes } = useStyles();
  focusManager.setFocused(undefined);

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
      >
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
            component={Link}
            to="/"
            // onClick={() => navigate("/", { replace: true })}
          >
            Get back to home page
          </Button>
        </div>
        <Image src={image} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );

  // const [timer, setTimer] = useState(4);
  // const [load, setLoad] = useState(true);

  // useEffect(() => {
  //   if (timer > 0) {
  //     setTimeout(() => {
  //       setTimer(timer - 1);
  //     }, 1000);
  //   } else navigate("/", { replace: true });
  // }, [timer, navigate]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoad(false);
  //   }, 800);
  // }, [load]);

  // return (
  //   <Container>
  //     {!load && (
  //       <>
  //         <Box>
  //           <h2>This page could not be found</h2>
  //           <h2>Redirecting to the homepage in {timer - 1} seconds.</h2>
  //         </Box>
  //       </>
  //     )}
  //   </Container>
  // );
};

export default PageNotFound;
