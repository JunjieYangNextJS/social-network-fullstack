import { SimpleGrid, Text, useMantineTheme, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { Copyright } from 'tabler-icons-react';

export default function FooterGrids({ whiteText }) {
  const aboutArray = [
    { label: 'About Us', to: 'about-us' },
    { label: 'Content Policy', to: 'content-policy' },
    { label: 'Follow on Twitter', to: 'follow-on-twitter' },

    { label: 'Privacy', to: 'privacy' },
    { label: 'Help', to: 'help' },
    { label: 'Terms of Service', to: 'terms-of-service' }
  ];

  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleNavigate = to => {
    if (to === 'follow-on-twitter') {
      const newWindow = window.open(
        'https://twitter.com/Jsquareapples',
        '_blank',
        'noopener,noreferrer'
      );
      if (newWindow) newWindow.opener = null;
      return;
    }

    navigate(`/${to}`);
  };

  return (
    <SimpleGrid cols={2} style={{ margin: 1 }} spacing="xs">
      {aboutArray.map(({ label, to }) => (
        <div
          onClick={() => handleNavigate(to)}
          style={{
            cursor: 'pointer',
            fontSize: '14px',
            color: whiteText ? 'white' : theme.colors.gray[7]
          }}
          key={label}
        >
          {label}
        </div>
      ))}
      <Group
        sx={{
          fontSize: '14px',
          color: whiteText ? 'white' : theme.colors.gray[7]
        }}
        spacing={2}
      >
        <Copyright
          size={15}
          color={whiteText ? 'white' : theme.colors.gray[7]}
        />{' '}
        2023 Priders.net
      </Group>
    </SimpleGrid>
  );
}
