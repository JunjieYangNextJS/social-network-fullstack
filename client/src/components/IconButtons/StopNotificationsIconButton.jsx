import React, { useState } from "react";
import { Bell, BellOff } from "tabler-icons-react";
import {
  ActionIcon,
  Indicator,
  Tooltip,
  Menu,
  ScrollArea,
  MenuLabel,
  Divider,
  Text,
} from "@mantine/core";
import { useDidUpdate, useDisclosure } from "@mantine/hooks";
import usePatchCreation from "../../react-query-hooks/usePatchCreaton";
import { findParentRouteFromRoute } from "./../../utility/findGenre";

import { showSuccess } from "../../utility/showNotifications";

export default function StopNotificationsIconButton({ parentId, route }) {
  const parentRoute = findParentRouteFromRoute(route);

  const { mutate, isSuccess, status } = usePatchCreation(parentRoute, parentId);

  useDidUpdate(() => {
    if (isSuccess) {
      showSuccess(
        "You will no longer receive new notifications from this, you can change this behavior anytime."
      );
    }
  }, [isSuccess]);

  const setNotifyToOff = () => {
    mutate({ willNotify: false });
  };

  return (
    <Tooltip
      wrapLines
      withArrow
      transition="fade"
      transitionDuration={200}
      label="Stop notifications from this"
      color="#909296"
    >
      <ActionIcon aria-label="Notifications" onClick={() => setNotifyToOff()}>
        <BellOff size={22} color={"black"} strokeWidth={1} />
      </ActionIcon>
    </Tooltip>
  );
}
