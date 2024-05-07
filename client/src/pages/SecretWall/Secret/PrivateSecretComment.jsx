import React from 'react';
import useUser from '../../../react-query-hooks/useUser/useUser';
import useSecretComment from './../../../react-query-hooks/useSecrets/useSecretComments/useSecretComment';
import SecretLayout from './SecretLayout';
import { createStyles } from '@mantine/core';
import { useParams } from 'react-router-dom';
import backgroundImage from './../../../images/hollow-tree.jpeg';

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundImage: `url(${backgroundImage})`
  },

  container: {
    padding: '100px 0 30px 0',
    backgroundColor: 'white',
    minHeight: '100vh',
    // borderRight: `1px solid ${
    //   theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    // }`,
    // minHeight: 900,

    // padding: "100px 30px 0 30px",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%'
    }
  },

  unstyledButton: {
    fontWeight: 500,
    display: 'block',
    cursor: 'pointer',
    // width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colors.gray[0],
      color: theme.black
    }
  }
}));

export default function PrivateSecretComment() {
  const { classes, theme } = useStyles();
  let params = useParams();
  // const navigate = useNavigate();
  const { data: user } = useUser();

  const {
    isLoading,
    isError,
    data,
    error,
    status: getStatus
  } = useSecretComment(params.secretCommentId);

  return (
    <div className={classes.wrapper}>
      {data && (
        <SecretLayout
          classes={classes}
          theme={theme}
          user={user}
          data={data}
          secretCommentId={params.secretCommentId}
        />
      )}
    </div>
  );
}
