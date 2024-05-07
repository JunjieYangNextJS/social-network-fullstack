import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  useMantineTheme
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useSetSecretTellerUsername } from '../../contexts/SecretTellerUsernameContext';

export default function OurCommunityCard({ route }) {
  const theme = useMantineTheme();

  const setSecretTellerUsername = useSetSecretTellerUsername();

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <Card shadow="xl" p="lg">
      <div style={{ marginBottom: 12, marginTop: theme.spacing.xs }}>
        <Text weight={500}>Our Community</Text>
      </div>
      <Stack>
        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          A platform built for our LGBTQIA2S+ community where everyone can
          safely and comfortably share and discuss about their lives and
          feelings.
        </Text>
        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          We are aware that there are people in need for caring and answers. We
          encourage our community to embrace one another and make our lives
          better together.
        </Text>
      </Stack>

      <Button
        component={Link}
        to="/DM/priders"
        variant="light"
        color={route === 'stories' ? 'grape' : theme.primaryColor}
        fullWidth
        style={{ marginTop: 14 }}
        onClick={() => setSecretTellerUsername('')}
      >
        Reviews / Suggestions
      </Button>
    </Card>
    // </div>
  );
}
