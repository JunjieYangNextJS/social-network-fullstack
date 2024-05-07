import react, { useState, useEffect } from 'react';
import { Menu, Divider, Text, Tooltip } from '@mantine/core';
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
  Speakerphone
} from 'tabler-icons-react';
import { useClipboard, useDisclosure, useDidUpdate } from '@mantine/hooks';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { usePatchArrayMethod } from './../../react-query-hooks/useUser/usePatchUser';
import ReportModal from './../Modals/ReportModal';

import DeleteModal from '../Modals/DeleteModal';
import usePatchPinnedComment from './../../react-query-hooks/usePatchPinned';
import findGenre from '../../utility/findGenre';
import usePatchCreation, {
  usePatchCreationSubscribers
} from './../../react-query-hooks/usePatchCreaton';
import { usePatchUnderstatedComment } from '../../react-query-hooks/useStoryComments/usePatchStoryComment';

export default function CommentActionMenu({
  itemId,
  itemCreatorId,
  itemEndpoint,
  userId,
  setDataName,
  oldPagesArray,
  handleDeleteItem,
  deleteStatus,
  navigateToOrigin,
  setReadOnly,
  postOrStoryRoute,
  postOrStoryCreatorId,
  postOrStoryId,
  pinned,
  refetch,
  index,
  willNotifyCommenter,
  understated,
  setRteText,
  pinnedQueryName,
  subscribers
}) {
  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isNotifying, setIsNotifying] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsNotifying(willNotifyCommenter);
    setIsSubscribed(subscribers?.includes(userId));
  }, [willNotifyCommenter, subscribers, userId]);

  const { mutate: patchCreationWillNotify } = usePatchCreation(
    itemEndpoint + '/patchWillNotifyCommenter',
    itemId
  );

  const { mutate: patchPinnedComment, status } = usePatchPinnedComment(
    postOrStoryRoute,
    postOrStoryId,
    findGenre(postOrStoryRoute)
  );

  const { mutate: patchUnderstated } = usePatchUnderstatedComment(
    itemId,
    postOrStoryId
  );

  const { mutate: patchSubscribers } = usePatchCreationSubscribers(
    itemEndpoint,
    itemId
  );

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useDidUpdate(() => {
    if (status === 'error') {
      queryClient
        .invalidateQueries([findGenre(postOrStoryRoute), postOrStoryId])
        .then(() => handlers.close());
    }
  }, [status]);

  const handleReport = () => {
    if (!userId) return navigate('/login');

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

  const handlePinnedComment = () => {
    if (status === 'loading') return;

    if (pinned === itemId) {
      queryClient.removeQueries([pinnedQueryName, pinned]);
      patchPinnedComment({ pinned: '' });
    } else {
      queryClient.removeQueries([pinnedQueryName, pinned]);
      patchPinnedComment({ pinned: itemId });
    }
  };

  const handleChangeWillNotify = () => {
    patchCreationWillNotify({ willNotifyCommenter: !isNotifying });
    setIsNotifying(!isNotifying);

    handlers.close();
  };

  const handleUnderstatedComment = () => {
    patchUnderstated();

    handlers.close();
  };

  const handlePatchSubscribers = () => {
    patchSubscribers({ isSubscribed });
    setIsSubscribed(!isSubscribed);

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
        {itemCreatorId !== userId && (
          <Tooltip
            label={
              isSubscribed
                ? 'You will stop receiving notifications for future comments'
                : 'You will receive notifications for future comments'
            }
          >
            <Menu.Item
              icon={<Speakerphone size={14} />}
              onClick={() => handlePatchSubscribers()}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Menu.Item>
          </Tooltip>
        )}
        <Menu.Item
          icon={<MessageReport size={14} />}
          onClick={() => handleReport()}
        >
          Report
        </Menu.Item>
        {postOrStoryCreatorId === userId && (
          <Menu.Item
            icon={<Pin size={14} />}
            onClick={() => handlePinnedComment()}
          >
            {pinned === itemId ? 'Unpin' : 'Pin to the top'}
          </Menu.Item>
        )}

        {postOrStoryCreatorId === userId && itemEndpoint === 'storyComments' && (
          <Menu.Item
            icon={<Pin size={14} />}
            onClick={() => handleUnderstatedComment()}
          >
            {understated ? 'Normalize this' : 'Understate this'}
          </Menu.Item>
        )}

        {itemCreatorId === userId && (
          <>
            <Divider />
            <Menu.Item
              onClick={() => handleChangeWillNotify()}
              // color="red"
              icon={
                isNotifying ? <BellOff size={14} /> : <BellRinging size={14} />
              }
            >
              {isNotifying ? 'Turn off notifications' : 'Turn on notifications'}
            </Menu.Item>

            <Menu.Item
              onClick={() => handleEdit()}
              // color="red"
              icon={<Pencil size={14} />}
            >
              Edit my comment
            </Menu.Item>

            <Menu.Item
              onClick={() => handleDelete()}
              color="red"
              icon={<Trash size={14} />}
            >
              Delete my comment
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
        oldPagesArray={oldPagesArray}
        itemEndpoint={itemEndpoint}
        handleDeleteItem={handleDeleteItem}
        deleteStatus={deleteStatus}
        navigateToOrigin={navigateToOrigin}
        setDataName={setDataName}
        setRteText={setRteText}
        understated={understated}
      />
    </>
  );
}
