import React, { useState, useEffect } from "react";
import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  UnstyledButton,
  Indicator,
  Avatar,
  Text,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  Notes,
  CalendarStats,
  Gauge,
  PresentationAnalytics,
  FileAnalytics,
  Adjustments,
  Lock,
  DotsVertical,
  Eye,
  Flag,
  OctagonOff,
  HandOff,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import ReportModal from "./../../../components/Modals/ReportModal";
import BlockUserModal from "./../../../components/Modals/UserRelated/BlockUserModal";
import RemoveFriendModal from "./../../../components/Modals/UserRelated/RemoveFriendModal";

export default function FriendMenu({ profileName, username, id, theme, me }) {
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const [blockUserOpen, setBlockUserOpen] = useState(false);
  const [removeFriendOpen, setRemoveFriendOpen] = useState(false);

  const MenuItems = [
    {
      label: "View profile",
      icon: <Eye color={theme.colors.gray[6]} size={20} />,
      onClick: () => navigate(`/users/${username}`),
    },

    {
      label: `Report @${username}`,
      icon: <Flag color={theme.colors.gray[6]} size={20} />,
      onClick: () => setReportOpen(true),
    },
    {
      label: me?.blockedUsers?.includes(id)
        ? `Unblock @${username}`
        : `Block @${username}`,
      icon: <OctagonOff color={theme.colors.gray[6]} size={20} />,
      onClick: () => setBlockUserOpen(true),
    },
    {
      label: `Unfriend @${username}`,
      icon: <HandOff color={theme.colors.gray[6]} size={20} />,
      onClick: () => setRemoveFriendOpen(true),
    },
  ];

  return (
    <>
      <Menu
        control={
          <ActionIcon
            variant="transparent"
            // color={theme.primaryColor}
            size={25}
          >
            <DotsVertical size={16} />
          </ActionIcon>
        }
        transition="pop"
        placement="end"
      >
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
    </>
  );
}
