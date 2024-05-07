import {
  Container,
  Divider,
  Group,
  UnstyledButton,
  createStyles,
  ActionIcon,
  Title,
} from "@mantine/core";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFollowers } from "./../../../react-query-hooks/useOtherUsers/useOtherUser";
import FollowBlock from "./FollowBlock";
import SearchedItemsCard from "./../../../components/Cards/SearchedItemsCard";
import RelatedPeopleCard from "../../../components/Cards/RelatedPeopleCard/RelatedPeopleCard";
import RelatedPeopleRightStack from "./../../../components/SorterStack/RelatedPeopleRightStack";
import { ArrowBigLeft } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    marginTop: 10,
    // border: "1px solid black",
    maxHeight: 90,
    // width: "100%",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[1],
      color: theme.black,
    },
  },
}));

export default function Followers() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, classes } = useStyles();

  const user = queryClient.getQueryData(["user"]);

  const { data } = useGetFollowers(params.username);

  const urlParts = window.location.href.split("/");

  return (
    <Container size="lg" sx={{ paddingTop: 120 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "30px",
        }}
      >
        <div>
          <Group sx={{ marginBottom: 20 }}>
            <ActionIcon
              size="lg"
              onClick={() => navigate(`/users/${params.username}`)}
              radius="lg"
            >
              <ArrowBigLeft />
            </ActionIcon>
            <Title order={4}>@{params.username}</Title>
          </Group>
          <Group>
            <UnstyledButton
              onClick={() => navigate(`/users/${params.username}/following`)}
              className={classes.control}
              sx={{
                backgroundColor:
                  urlParts[urlParts.length - 1] === "following"
                    ? theme.colors.gray[0]
                    : "white",
              }}
            >
              Following
            </UnstyledButton>
            <UnstyledButton
              onClick={() => navigate(`/users/${params.username}/followers`)}
              className={classes.control}
              sx={{
                backgroundColor:
                  urlParts[urlParts.length - 1] === "followers"
                    ? theme.colors.gray[0]
                    : "white",
              }}
            >
              Followers
            </UnstyledButton>
          </Group>
          <Divider />
          {data &&
            data.map(
              ({
                profileName,
                username,
                id,
                role,
                photo,
                bio,
                sexuality,
                gender,
              }) => (
                <FollowBlock
                  profileName={profileName}
                  key={id}
                  username={username}
                  role={role}
                  photo={photo}
                  bio={bio}
                  gender={gender}
                  sexuality={sexuality}
                />
              )
            )}
        </div>
        <div
          style={{
            marginLeft: 50,
          }}
        >
          <RelatedPeopleRightStack user={user} />
        </div>
      </div>
    </Container>
  );
}
