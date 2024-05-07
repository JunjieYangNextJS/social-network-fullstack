import react, { useState, useEffect } from "react";
import { Menu, Divider, Text } from "@mantine/core";
import {
  Pin,
  Search,
  Photo,
  MessageCircle,
  Trash,
  Pencil,
  ArrowsLeftRight,
  MessageReport,
  BellRinging,
  BellOff,
} from "tabler-icons-react";
import { useClipboard, useDisclosure, useDidUpdate } from "@mantine/hooks";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { usePatchArrayMethod } from "./../../react-query-hooks/useUser/usePatchUser";
import ReportModal from "./../Modals/ReportModal";

import DeleteModal from "../Modals/DeleteModal";
import usePatchPinnedComment from "./../../react-query-hooks/usePatchPinned";
import findGenre from "../../utility/findGenre";
import usePatchCreation from "./../../react-query-hooks/usePatchCreaton";
import { usePatchUnderstatedComment } from "../../react-query-hooks/useStoryComments/usePatchStoryComment";

export default function ReplyActionMenu({
  itemId,
  itemCreatorId,
  itemEndpoint,
  userId,
  setDataName,
  handleDeleteItem,
  deleteStatus,
  invalidateCommentPage,
  setReadOnly,

  setRteText,
}) {
  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleReport = () => {
    if (!userId) return navigate("/login");

    setReportOpen(true);
    handlers.close();
  };

  const handleDelete = () => {
    setDeleteOpen(true);

    handlers.close();
  };

  const handleEdit = () => {
    setReadOnly(false);

    handlers.close();
  };

  return (
    <>
      <Menu
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        closeOnItemClick={false}
      >
        <Menu.Item
          icon={<MessageReport size={14} />}
          onClick={() => handleReport()}
        >
          Report
        </Menu.Item>

        {itemCreatorId === userId && (
          <>
            <Divider />

            <Menu.Item
              onClick={() => handleEdit()}
              // color="red"
              icon={<Pencil size={14} />}
            >
              Edit my reply
            </Menu.Item>

            <Menu.Item
              onClick={() => handleDelete()}
              color="red"
              icon={<Trash size={14} />}
            >
              Delete my reply
            </Menu.Item>
          </>
        )}
      </Menu>
      <ReportModal
        setOpened={setReportOpen}
        opened={reportOpen}
        itemId={itemId}
        userId={userId}
        itemEndpoint={itemEndpoint}
      />
      <DeleteModal
        setOpened={setDeleteOpen}
        opened={deleteOpen}
        itemId={itemId}
        itemEndpoint={itemEndpoint}
        handleDeleteItem={handleDeleteItem}
        deleteStatus={deleteStatus}
        setDataName={setDataName}
        setRteText={setRteText}
        invalidateCommentPage={invalidateCommentPage}
      />
    </>
  );
}
