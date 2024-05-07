import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, IconButton, Button, Alert, Box } from '@mantine/core';
import { useQueryClient } from 'react-query';
import Page403 from '../../../Page403';
import useOtherUser, {
  useOtherUserLikeMinded
} from '../../../../react-query-hooks/useOtherUsers/useOtherUser';
import useUser from '../../../../react-query-hooks/useUser/useUser';

import OtherUserIntroCard from './OtherUserIntroCard';

import PageNotFound from '../../../PageNotFound';
import OtherUserPosts from './OtherUserPosts';
import OtherUserStories from './OtherUserStories';
import OtherUserCreationsNavbar from './OtherUserCreationsNavbar';
import RelatedPeopleCard from '../../../../components/Cards/RelatedPeopleCard/RelatedPeopleCard';

export default function OtherUserProfilePage() {
  let params = useParams();
  const navigate = useNavigate();

  const { data: user } = useUser();
  const [errorMessage, setErrorMessage] = useState(null);

  const { data: otherUser, status } = useOtherUser(
    params.username,
    setErrorMessage
  );

  const { data: otherUserLikeMinded } = useOtherUserLikeMinded(
    otherUser?.username,
    otherUser?.gender,
    otherUser?.sexuality
  );

  useEffect(() => {
    if (user?.username === params.username)
      navigate('/me/home', { replace: true });
  }, [user, params.username, navigate]);

  return (
    <Box
      sx={{
        backgroundColor: '#F1F3F5',
        paddingTop: 60,
        minHeight: `calc(100vh - 60px)`
      }}
    >
      {errorMessage === 'Ouch, You have been forbidden to view this page' && (
        <Page403 message="Ouch, You have been forbidden to view this page" />
      )}
      {errorMessage === 404 && <PageNotFound />}

      {otherUser && (
        <Container>
          <OtherUserIntroCard
            otherUser={otherUser}
            user={user}
            navigate={navigate}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '30px',
              marginTop: '20px'
            }}
          >
            <div style={{ width: 600 }}>
              {' '}
              <OtherUserCreationsNavbar username={params.username} />
              {window.location.pathname === `/users/${params.username}` && (
                <OtherUserPosts otherUser={otherUser} user={user} />
              )}
              {window.location.pathname ===
                `/users/${params.username}/stories` && (
                <OtherUserStories otherUser={otherUser} user={user} />
              )}
            </div>
            <div>
              <RelatedPeopleCard
                items={otherUserLikeMinded}
                user={user}
                message="Similar people"
                otherUserId={otherUser?._id}
              />
            </div>
          </div>
        </Container>
      )}
    </Box>
  );
}
