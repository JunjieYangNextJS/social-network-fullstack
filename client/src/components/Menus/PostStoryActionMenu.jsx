import react, { useState, useEffect } from 'react';
import { Menu, Divider, Text, Tooltip } from '@mantine/core';
import {
  Settings,
  Search,
  Photo,
  MessageCircle,
  Trash,
  Pencil,
  BellOff,
  BellRinging,
  ArrowsLeftRight,
  Speakerphone
} from 'tabler-icons-react';
import { useClipboard, useDisclosure, useDidUpdate } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import findGenre from './../../utility/findGenre';
import { usePatchArrayMethod } from './../../react-query-hooks/useUser/usePatchUser';
import ReportModal from './../Modals/ReportModal';

import DeleteModal from '../Modals/DeleteModal';
import usePatchCreation, {
  usePatchCreationSubscribers
} from '../../react-query-hooks/usePatchCreaton';
import { useUpdateOpenComments } from '../../react-query-hooks/useStories/usePatchStory';

export default function PostStoryActionMenu({
  itemId,
  itemCreatorId,
  itemEndpoint,
  userId,
  oldPagesArray,
  handleDeleteItem,
  deleteStatus,
  navigateToOrigin,
  setReadOnly,
  willNotify,
  openComments,
  subscribers,
  sticky
}) {
  const [opened, handlers] = useDisclosure(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isNotifying, setIsNotifying] = useState(true);
  const [isOpenComments, setIsOpenComments] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 600 });

  useEffect(() => {
    setIsNotifying(willNotify);
    setIsOpenComments(openComments);
    setIsSubscribed(subscribers?.includes(userId));
  }, [willNotify, openComments, subscribers, userId]);

  const { mutate: patchUserPostHide } = usePatchArrayMethod(
    itemEndpoint === 'stories' ? 'addHiddenStory' : 'addHiddenPost'
  );
  const { mutate: patchCreationWillNotify } = usePatchCreation(
    itemEndpoint,
    itemId
  );
  const { mutate: patchSubscribers } = usePatchCreationSubscribers(
    itemEndpoint,
    itemId
  );
  const { mutate: patchOpenComments } = useUpdateOpenComments(itemId);

  const handleClipboard = () => {
    clipboard.copy(`https://www.priders.net/${itemEndpoint}/${itemId}`);
    setTimeout(() => {
      handlers.close();
    }, 500);
  };

  const handleHide = () => {
    if (!userId) return navigate('/login');
    patchUserPostHide(itemId);
    handlers.close();
  };

  const handleReport = () => {
    if (!userId) return navigate('/login');
    setReportOpen(true);
    handlers.close();
  };

  const handlePatchSubscribers = () => {
    if (!userId) return navigate('/login');
    patchSubscribers({ isSubscribed });
    setIsSubscribed(!isSubscribed);

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

  const handleChangeWillNotify = () => {
    patchCreationWillNotify({ willNotify: !isNotifying });
    setIsNotifying(!isNotifying);

    handlers.close();
  };
  const handlePatchOpenComments = () => {
    patchOpenComments();
    setIsOpenComments(!isOpenComments);

    handlers.close();
  };

  return (
    <>
      <Menu
        onClick={e => e.preventDefault()}
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        closeOnItemClick={false}
      >
        <Menu.Item icon={<Photo size={14} />} onClick={() => handleClipboard()}>
          {clipboard.copied ? 'Copied' : 'Copy link'}
        </Menu.Item>

        <Menu.Item icon={<Settings size={14} />} onClick={() => handleHide()}>
          Hide
        </Menu.Item>

        {itemCreatorId !== userId && !sticky && !oldPagesArray && (
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
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </Menu.Item>
          </Tooltip>
        )}

        {itemCreatorId !== userId && !sticky && !oldPagesArray && (
          <Menu.Item
            icon={<MessageCircle size={14} />}
            onClick={() => handleReport()}
          >
            Report
          </Menu.Item>
        )}

        {itemCreatorId === userId && !oldPagesArray && !sticky && (
          <>
            <Divider />
            <Menu.Item
              onClick={() => handleEdit()}
              // color="red"
              icon={<Pencil size={14} />}
            >
              Edit my {findGenre(itemEndpoint)}
            </Menu.Item>

            <Menu.Item
              onClick={() => handleChangeWillNotify()}
              // color="red"
              icon={
                isNotifying ? <BellOff size={14} /> : <BellRinging size={14} />
              }
            >
              {isNotifying ? 'Turn off notifications' : 'Turn on notifications'}
            </Menu.Item>

            {itemEndpoint === 'stories' && (
              <Menu.Item
                onClick={() => handlePatchOpenComments()}
                // color="red"
                icon={<Pencil size={14} />}
              >
                {isOpenComments ? 'Turn off comments' : 'Turn on comments'}
              </Menu.Item>
            )}

            <Menu.Item
              onClick={() => handleDelete()}
              color="red"
              icon={<Trash size={14} />}
            >
              Delete my {findGenre(itemEndpoint)}
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
      />
    </>
  );
}
