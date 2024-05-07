import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, createStyles, Divider } from '@mantine/core';

import useUser from '../../../react-query-hooks/useUser/useUser';

import useSecret from '../../../react-query-hooks/useSecrets/useSecret';

import SecretContent from './SecretContent';

import SecretLayout from './SecretLayout';
import backgroundImage from './../../../images/hollow-tree.jpeg';

import TellerCommentContainer from './TellerCommentContainer';

const useStyles = createStyles(theme => ({
  wrapper: {
    // minHeight: "100vh",
    width: '100%',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundImage: `url(${backgroundImage})`
    // backgroundImage: `url(${treeHollow})`,
    // paddingTop: 120,
  },

  container: {
    padding: '120px 0 30px 0',
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

const Secret = () => {
  // const [commentContent, setCommentContent] = useState("");
  // const [opened, setOpened] = useState(false);
  // const ref = useClickOutside(() => setOpened(false));
  // const [Secret, setSecret] = useState(null);
  // const [newLikes, setNewLikes] = useState(null);
  const { classes, theme } = useStyles();
  let params = useParams();
  // const navigate = useNavigate();
  const { data: user } = useUser();

  const { isLoading, isError, data, error, status: getStatus } = useSecret(
    params.secretId
  );

  // const { mutate: createSecretComment, isSuccess } = useCreateSecretComment(
  //   data?.secret.id
  // );

  // const { mutate: patchSecret } = usePatchSecret(data?.secret.id);
  // const { mutate: deleteSecret, status: secretDeleteStatus } = useDeleteSecret(
  //   data?.secret.id
  // );

  // if (secretDeleteStatus === "error") navigate("/tree-hollow", { push: true });

  // const handleDelete = () => {
  //   deleteSecret(data?.secret.id);
  // };

  // const handleConfirmComment = () => {
  //   if (data.secret.secretTeller === user?.id) {
  //     createSecretComment({
  //       secret: data?.secret.id,
  //       content: commentContent,
  //       // commenter:
  //     });
  //   } else {
  //     createSecretComment({
  //       secret: data?.secret.id,
  //       content: commentContent,
  //     });
  //   }

  //   setCommentContent("");
  //   setOpened(false);
  // };

  // const handleCancelComment = () => {
  //   setCommentContent("");
  //   setOpened(false);
  // };

  const [active, setActive] = useState('');

  return (
    <div className={classes.wrapper}>
      {/* {data?.secret.id === user?.id ? } */}
      {data &&
        user &&
        (data.secret.secretTeller !== user.id ? (
          <SecretLayout
            classes={classes}
            theme={theme}
            user={user}
            data={data}
            hiddenSecrets={user?.hiddenSecrets}
          />
        ) : (
          <Container className={classes.container}>
            <SecretContent secret={data?.secret} userId={user?.id} />
            {data.comments.length === 0 && (
              <Divider
                my="xs"
                variant="dashed"
                sx={{ marginTop: 100 }}
                // labelPosition="center"
                // label="Only you and this person can see this conversation"
              />
            )}
            {data.comments.map((el, i) => (
              <TellerCommentContainer
                el={el}
                key={el._id}
                index={i + 1}
                user={user}
                classes={classes}
                active={active}
                setActive={setActive}
                theme={theme}
              />
            ))}
          </Container>
        ))}
    </div>
  );
};

export default Secret;
