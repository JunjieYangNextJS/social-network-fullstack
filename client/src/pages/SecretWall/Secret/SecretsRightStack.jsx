import React from 'react';
import { Stack, Button, useMantineTheme, Card, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

import FooterGrids from '../../../components/Grids/FooterGrids';
import { useSetSecretTellerUsername } from './../../../contexts/SecretTellerUsernameContext';

export default function SecretsRightStack({ user }) {
  const theme = useMantineTheme();

  const setSecretTellerUsername = useSetSecretTellerUsername();

  return (
    <Stack
      sx={{
        width: '300px',
        position: 'relative',
        '@media (max-width: 800px)': {
          display: 'none'
        }
      }}
    >
      <Button component={Link} to={user ? `/tree-hollow/create` : '/login'}>
        Create voice
      </Button>

      <Card shadow="xl" p="lg">
        <div style={{ marginBottom: 12, marginTop: theme.spacing.xs }}>
          <Text weight={500}>Tree Hollow</Text>
        </div>
        <Stack>
          <Text
            size="sm"
            style={{ color: theme.colors.gray[7], lineHeight: 1.5 }}
          >
            Are there things you want to say it out but cannot find the right
            listeners? This is a place where you can feel safe to share every
            little thing in your life anonymously.
          </Text>
          <Text
            size="sm"
            style={{ color: theme.colors.gray[7], lineHeight: 1.5 }}
          >
            You can filter your listeners to your liking. You can conformably
            have a private conversation with them. We need more of your voice.
          </Text>
        </Stack>

        <Button
          component={Link}
          to="/DM/priders"
          variant="light"
          color="blue"
          fullWidth
          style={{ marginTop: 14 }}
          onClick={() => setSecretTellerUsername('')}
        >
          Reviews / Suggestions
        </Button>
      </Card>
      <Stack sx={{ position: 'sticky', top: -400 }}>
        <FooterGrids whiteText={true} />
      </Stack>
    </Stack>
  );
}
