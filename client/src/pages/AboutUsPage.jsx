import { Container, Text } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage() {
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: 120 }}>
      <Container>
        <strong>
          <span style={{ lineHeight: '22.5px', fontSize: 26 }}>ABOUT US</span>
        </strong>
        <div style={{ paddingTop: 50 }}>
          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            Priders.net is a social network created especially for our LGBTQ2S+
            community. Our intention is to provide a safe and positive place for
            our people to talk about our lives. We can discuss on any topics
            with appropriate manners. From little things to important events, we
            value everything that happens to any one of us, and look forward to
            having you sharing your stories.
          </Text>

          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            We encourage our users to chat and connect with one another. We
            believe bonding makes our community stronger. We also encourage our
            users to sign up and complete our profiles for the full user
            experience.
          </Text>

          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            Priders.net has three main sections, Forum, Stories ,and Tree
            Hollow. Although there are no limitations on which section a user
            chooses to use for posting, we do recommend our users to read the
            following to understand how to utilize them in your benefits.
          </Text>
          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            Forum is structurally designed in a way that is best used for
            throwing out a topic or creating a poll. It features infinite scroll
            and gives users the best viewing experience for posts that are
            mainly focused on discussions.
          </Text>
          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            Stories is structurally designed in a way that is best used for
            sharing our everyday lives. It features pagination and 'See
            storyteller'. This helps when the timeline of the story might matter
            so users can easily pick up where they left off. It is designed to
            be more storyteller centric so the story-teller has more control
            over their creations.
          </Text>
          <Text weight={500} size="lg" sx={{ marginBottom: 40 }}>
            Tree Hollow is structurally designed in a way that is best used for
            feeling free to let your voice out. You can say anything here
            anonymously. It can be your little secrets that is been hiding from
            a week or years. It can be some rants about something that has
            bothered you for a while and you just want to let it all out. It can
            be anything as long as it follows our{' '}
            <Text
              component="span"
              onClick={() => navigate('/content-policy')}
              underline
              color="blue"
              weight={500}
              size="lg"
              sx={{ cursor: 'pointer' }}
            >
              rules
            </Text>
            . You get to decide on which group of people would be able to view
            your echo and for how long your echo would last.
          </Text>
        </div>
      </Container>
    </div>
  );
}
