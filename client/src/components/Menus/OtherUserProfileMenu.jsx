import React, { useState } from "react";
import {
  Dots,
  DotsVertical,
  Eye,
  Link,
  Flag,
  OctagonOff,
  HandOff,
} from "tabler-icons-react";
import { useClipboard, useDisclosure, useDidUpdate } from "@mantine/hooks";
import { Menu, Group, ActionIcon } from "@mantine/core";
import ReportModal from "./../Modals/ReportModal";
import BlockUserModal from "./../Modals/UserRelated/BlockUserModal";
import ViewUserBioModal from "./../Modals/UserRelated/ViewUserBioModal";
import RemoveFriendModal from "../Modals/UserRelated/RemoveFriendModal";

export default function OtherUserProfileMenu({
  theme,
  username,
  me,
  id,
  bio,
  friendList,
}) {
  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockUserOpen, setBlockUserOpen] = useState(false);
  const [removeFriendOpen, setRemoveFriendOpen] = useState(false);
  const [viewBioOpen, setViewBioOpen] = useState(false);

  const clipboard = useClipboard({ timeout: 600 });

  const handleDeleteFriend = () => {
    setRemoveFriendOpen(true);
    handlers.close();
  };

  const handleClipboard = () => {
    clipboard.copy(window.location.href);
    setTimeout(() => {
      handlers.close();
    }, 500);
  };
  const handleReport = () => {
    setReportOpen(true);
    handlers.close();
  };

  const handleBlockUser = () => {
    setBlockUserOpen(true);
    handlers.close();
  };

  const handleViewBio = () => {
    setViewBioOpen(true);
    handlers.close();
  };

  let MenuItems = [
    {
      label: "View complete bio",
      icon: <Eye color={theme.colors.gray[6]} size={20} />,
      onClick: () => handleViewBio(),
    },
    {
      label: clipboard.copied ? "Copied" : "Copy profile link",
      icon: <Link color={theme.colors.gray[6]} size={20} />,
      onClick: () => handleClipboard(),
    },
    {
      label: `Report @${username}`,
      icon: <Flag color={theme.colors.gray[6]} size={20} />,
      onClick: () => handleReport(),
    },
    {
      label: me?.blockedUsers?.includes(id)
        ? `Unblock @${username}`
        : `Block @${username}`,
      icon: <OctagonOff color={theme.colors.gray[6]} size={20} />,
      onClick: () => handleBlockUser(),
    },
  ];

  friendList?.includes(me?.id) &&
    MenuItems.push({
      label: `Unfriend @${username}`,
      icon: <HandOff color={theme.colors.gray[6]} size={20} />,
      onClick: () => handleDeleteFriend(),
    });

  return (
    <>
      <Menu
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        closeOnItemClick={false}
        control={
          <ActionIcon size={35} variant="default" radius="xl">
            <DotsVertical size={20} />
          </ActionIcon>
        }
        size="xl"
      >
        <Menu.Label>More options</Menu.Label>
        {MenuItems.map(({ label, icon, onClick }) => (
          <Menu.Item onClick={onClick} key={label}>
            <Group spacing={10}>
              {icon}
              {label}
            </Group>
          </Menu.Item>
        ))}
      </Menu>
      <ReportModal
        setOpened={setReportOpen}
        opened={reportOpen}
        itemId={id}
        userId={me?.id}
        itemEndpoint="users"
      />
      <BlockUserModal
        setOpened={setBlockUserOpen}
        opened={blockUserOpen}
        id={id}
        blockedUsers={me?.blockedUsers}
        otherUserUsername={username}
      />
      <RemoveFriendModal
        setOpened={setRemoveFriendOpen}
        opened={removeFriendOpen}
        friendId={id}
        friendUsername={username}
        meId={me?.id}
      />
      <ViewUserBioModal
        bio={bio}
        opened={viewBioOpen}
        setOpened={setViewBioOpen}
      />
    </>
  );
}
