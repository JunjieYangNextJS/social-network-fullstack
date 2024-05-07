import React, { useState, useMemo } from 'react';
import HoverUserCard from './Cards/HoverUserCard';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetHoverOtherUser } from '../react-query-hooks/useOtherUsers/useOtherUser';
import { Avatar, Center, Indicator, Menu, Loader } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';

export default function AvatarComponent({
  creator,
  username,
  profileName,
  role,
  photo,
  id,
  creationId,
  myId,
  noHoverCard
}) {
  const [mouseEnterUserId, setMouseEnterUserId] = useState(null);
  const [debouncedUserId] = useDebouncedValue(mouseEnterUserId, 500);

  const { data: debouncedUserData } = useGetHoverOtherUser(debouncedUserId);
  const navigate = useNavigate();

  const navigateToUserProfile = e => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/users/${username}`);
  };

  return (
    <>
      {role === 'bot' ? (
        <Avatar src={null} alt={profileName} radius="xl" size="md" />
      ) : (
        <>
          {noHoverCard ? (
            <Indicator
              inline
              size={10}
              offset={5}
              position="bottom-end"
              color="red"
              withBorder
              disabled={role !== 'admin'}
            >
              <Avatar
                src={photo}
                alt={profileName}
                radius="xl"
                // component={Link}
                size="md"
                // to={`/users/${posterUsername}`}
                onClick={e => navigateToUserProfile(e)}
              />
            </Indicator>
          ) : (
            <Menu
              onMouseEnter={() => setMouseEnterUserId(id)}
              onMouseLeave={() => setMouseEnterUserId('')}
              control={
                <Indicator
                  inline
                  size={10}
                  offset={5}
                  position="bottom-end"
                  color="red"
                  withBorder
                  disabled={role !== 'admin'}
                >
                  <Avatar
                    src={photo}
                    alt={profileName}
                    radius="xl"
                    // component={Link}
                    size="md"
                    // to={`/users/${username}`}
                    onClick={e => navigateToUserProfile(e)}
                  />
                </Indicator>
              }
              trigger="hover"
              size="auto"
              // delay={500}
              zIndex={2000}
              menuId={`${id} ${creationId} hover menu`}

              // withArrow
            >
              {debouncedUserData && creator ? (
                <HoverUserCard
                  debouncedUserData={debouncedUserData}
                  myId={myId}
                  commenter={creator}
                />
              ) : (
                <Center>
                  <Loader />
                </Center>
              )}
            </Menu>
          )}
        </>
      )}
    </>
  );
}
