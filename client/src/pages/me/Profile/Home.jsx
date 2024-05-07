import React, { useState } from "react";
import {
  Container,
  Box,
  Group,
  useMantineTheme,
  Indicator,
  Avatar,
  Text,
  Card,
} from "@mantine/core";
import SideNavbarNested from "../components/SideNavbarNested";
import EditProfileModal from "../../../components/Modals/EditProfileModal";
import useUser, {
  useGetMyFollowingPeople,
} from "../../../react-query-hooks/useUser/useUser";
import MyProfileIntroCard from "./MyProfileIntroCard";
import UserProtectedRoute from "../../../utility/UserProtectedRoute";
import MyFollowingPeoplePosts from "./MyFollowingPeoplePosts";
import MyFollowingPeopleCreationsNavbar from "./MyFollowingPeopleCreationsNavbar";
import MyFollowingPeopleStories from "./MyFollowingPeopleStories";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { data: followingPeople } = useGetMyFollowingPeople();

  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#F1F3F5",
        paddingTop: 55,
        minHeight: `calc(100vh - 55px)`,
      }}
    >
      {user && (
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <SideNavbarNested />
          <Container>
            <MyProfileIntroCard user={user} setOpened={setOpened} />
            <EditProfileModal
              user={user}
              opened={opened}
              setOpened={setOpened}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                marginTop: 70,
              }}
            >
              <div style={{ marginTop: 17, width: 300 }}>
                <Text weight={500} sx={{ marginLeft: 30 }}>
                  My followings
                </Text>
                <Card withBorder radius="md" sx={{ marginTop: 15 }} p="sm">
                  {followingPeople &&
                    followingPeople.map(
                      ({
                        photo,
                        profileName,
                        username,
                        _id,
                        role,
                        sexuality,
                        gender,
                      }) => (
                        <Group
                          key={_id}
                          spacing={10}
                          noWrap
                          onClick={() => navigate(`/users/${username}`)}
                          sx={{
                            overflow: "hidden",
                            cursor: "pointer",
                            // maxWidth: 700,
                            padding: "43px 15px",
                            // marginTop: 15,
                            height: 70,

                            "&:hover": {
                              background: theme.colors.gray[0],
                            },

                            // alignItems: "flex-start",
                          }}
                        >
                          <Indicator
                            inline
                            size={10}
                            offset={5}
                            position="bottom-end"
                            color="red"
                            withBorder
                            disabled={role !== "admin"}
                          >
                            <Avatar
                              src={photo}
                              alt={profileName}
                              radius="xl"
                              size="lg"
                            />
                          </Indicator>
                          <div>
                            <Text
                              weight={500}
                              color={theme.colors.dark[8]}
                              size="md"
                            >
                              {profileName}
                            </Text>
                            <Text size="sm" color="dimmed" weight={400}>
                              @{username}
                            </Text>
                            <Group spacing={7}>
                              {sexuality && (
                                <Text size="xs" weight={400}>
                                  {sexuality} ,
                                </Text>
                              )}
                              {gender && (
                                <Text size="xs" weight={400}>
                                  {gender}
                                </Text>
                              )}
                            </Group>
                          </div>
                        </Group>
                      )
                    )}
                </Card>
              </div>

              <div style={{ width: 600 }}>
                <MyFollowingPeopleCreationsNavbar />
                {window.location.pathname === `/me/home` && (
                  <MyFollowingPeoplePosts user={user} />
                )}
                {window.location.pathname === `/me/home/stories` && (
                  <MyFollowingPeopleStories user={user} />
                )}
              </div>
            </div>
          </Container>
        </Box>
      )}
    </Box>
  );
}
