import React, { useState, useEffect, useMemo } from 'react';
import {
  Avatar,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea
} from '@mantine/core';
import calcTimeAgo from '../../../utility/calcTimeAgo';
import SecretActionMenu from '../../../components/Menus/SecretActionMenu';
import EditableContentDiv from '../../../components/ReusableDivs/EditableContentDiv';
import usePatchSecret from '../../../react-query-hooks/useSecrets/usePatchSecret';
import { showChangesAreMemorized } from '../../../utility/showNotifications';

export default function SecretContent({ secret, userId, hiddenSecrets }) {
  const { content, id, secretTeller, createdAt, editedAt, expiredAt } = secret;
  const [readOnly, setReadOnly] = useState(true);
  const [contentText, setContentText] = useState('');
  const [expirationDaysLeft, setExpirationDaysLeft] = useState();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (content) setContentText(content);
  }, [content, setContentText]);

  const { mutate: editSecret } = usePatchSecret(id);

  useEffect(() => {
    setExpirationDaysLeft(
      Math.ceil((Date.parse(expiredAt) - Date.now()) / (1000 * 60 * 60 * 24))
    );
  }, [expiredAt]);

  // const ref = useClickOutside(() => setReadOnly(true));

  const handleConfirmEditSecret = () => {
    if (
      content === contentText &&
      Math.ceil(
        (Date.parse(expiredAt) - Date.now()) / (1000 * 60 * 60 * 24)
      ) === expirationDaysLeft
    )
      return setReadOnly(true);

    editSecret({
      content: contentText,
      expiredAt: expirationDaysLeft
    });

    setReadOnly(true);
  };

  const handleCancelEditSecret = () => {
    if (contentText !== content) showChangesAreMemorized();

    setContentText(content);
    setExpirationDaysLeft(
      Math.ceil((Date.parse(expiredAt) - Date.now()) / (1000 * 60 * 60 * 24))
    );
    setReadOnly(true);
  };

  return (
    <Card>
      {/* <Text sx={{ padding: 10 }}>{contentText}</Text> */}
      <Group
        sx={{ padding: 10 }}
        position="apart"
        onMouseEnter={() => setEntered(true)}
        onMouseLeave={() => setEntered(false)}
      >
        <div>
          {readOnly ? (
            <Group position="left">
              <Stack align="flex-start" spacing={1}>
                <Group
                  spacing={5}
                  // sx={{
                  //   position: "relative",
                  //   display: "flex",
                  // }}
                >
                  <Avatar
                    color={secretTeller === userId ? 'cyan' : 'blue'}
                    radius="xl"
                    sx={{ height: 45, width: 45 }}
                  >
                    {secretTeller === userId ? 'You' : 'They'}
                  </Avatar>
                  <EditableContentDiv
                    value={contentText}
                    readOnly={readOnly}
                    isMe={secretTeller === userId}
                  />
                </Group>

                <Group spacing={2}>
                  <SecretActionMenu
                    secret={secret}
                    userId={userId}
                    setReadOnly={setReadOnly}
                    entered={entered}
                    hiddenSecrets={hiddenSecrets}
                  />
                  <Text size="xs" color="dimmed">
                    {editedAt
                      ? calcTimeAgo(editedAt) + ' (edited)'
                      : calcTimeAgo(createdAt)}
                  </Text>
                </Group>
              </Stack>
            </Group>
          ) : (
            <Group>
              <Avatar
                color={secretTeller === userId ? 'cyan' : 'blue'}
                radius="xl"
                sx={{ height: 45, width: 45 }}
              >
                {secretTeller === userId ? 'You' : 'They'}
              </Avatar>
              <div style={{ width: '350px' }}>
                <Textarea
                  value={contentText}
                  onChange={event => setContentText(event.currentTarget.value)}
                  variant="unstyled"
                  autosize
                  minRows={1}
                  size="md"
                  color="#343a40"
                  sx={theme => ({
                    borderBottom: `1px solid ${theme.colors.gray[6]}`,

                    marginBottom: '3px'
                  })}
                />
                <Group position="apart">
                  <Group spacing={5}>
                    <NumberInput
                      hideControls
                      value={expirationDaysLeft}
                      onChange={val => setExpirationDaysLeft(val)}
                      min={1}
                      styles={{
                        input: { width: 45, textAlign: 'center' }
                      }}
                    />{' '}
                    <Text component="span" size="sm">
                      days left
                    </Text>
                  </Group>

                  <Group position="right" spacing={10}>
                    <Button
                      onClick={() => handleCancelEditSecret()}
                      variant="subtle"
                      color="gray"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleConfirmEditSecret()}
                      variant="light"
                    >
                      Confirm
                    </Button>
                  </Group>
                </Group>
              </div>
            </Group>
          )}
        </div>
      </Group>
    </Card>
  );
}
