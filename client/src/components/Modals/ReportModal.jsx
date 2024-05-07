import React, { useState } from "react";
import { Modal, Button, Group, Text } from "@mantine/core";
import ReusableChips from "../Chips/ReusableChips";
import usePatchReports from "../../react-query-hooks/usePatchReports";
import { useDidUpdate } from "@mantine/hooks";

const chipsArray = [
  "Hatred",
  "Spam",
  "Misinformation",
  "Harassment",
  "Violence",
  "Impersonation",
  "Doxing",
  "Plagiarism",
  "Other violations",
];

export default function ReportModal({
  itemId,
  itemEndpoint,
  userId,
  opened,
  setOpened,
}) {
  // const [opened, setOpened] = useState(false);
  const [value, setValue] = useState("");

  const { mutate: updateReports, status: reportStatus } = usePatchReports(
    itemId,
    itemEndpoint
  );

  useDidUpdate(() => {
    if (reportStatus === "loading") {
      setOpened(false);
    }
  }, [reportStatus]);

  const handleSubmitReport = () => {
    updateReports({
      reportedFor: value,
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        // title="We thank you for protecting yourself and our community. Please let us know what rules are being broken."
        centered
        size="sm"
        padding="xl"
      >
        <div style={{ padding: "10px 10px 0 10px" }}>
          <Text color="#24262b" sx={{ fontSize: 15, marginBottom: 20 }}>
            We thank you for protecting yourself and our community. Please let
            us know what rules are being broken.
          </Text>
          <div style={{ marginTop: 25, marginBottom: 20 }}>
            <ReusableChips
              chipsArray={chipsArray}
              value={value}
              setValue={setValue}
              multiple={false}
            />
          </div>

          <Group position="right">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => handleSubmitReport()}
              disabled={!value}
            >
              Submit
            </Button>
            <Button size="sm" variant="subtle" onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Group>
        </div>
      </Modal>

      {/* <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        centered
        size="sm"
        padding="xl"
      >
        {blockedUsers?.includes(id) ? (
          <div style={{ padding: "10px 10px 0 10px" }}>
            <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
              @{otherUserUsername} will be able to view your profile page,
              follow you, start a new chat with you or send you a friend
              request. Their posts and stories will no longer be hidden away
              from you.
            </Text>
            <Group position="right">
              <Button
                size="sm"
                variant="subtle"
                onClick={() => removeBlockUser(id)}
                disabled={addLoading || removeLoading}
              >
                Unblock
              </Button>
              <Button
                size="sm"
                variant="subtle"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
            </Group>
          </div>
        ) : (
          <div style={{ padding: "10px 10px 0 10px" }}>
            <Text color="#373A40" size="lg" weight={700}>
              Block @{otherUserUsername}?
            </Text>
            <Text sx={{ fontSize: 15, marginTop: 20, marginBottom: 20 }}>
              @{otherUserUsername} can no longer follow you, start a new chat
              with you or send you a friend request. Your profile page will be
              protected from viewing. Their posts and stories will be hidden
              away from you.
            </Text>
            <Group position="right">
              <Button
                size="sm"
                variant="subtle"
                onClick={() => addBlockUser(id)}
                disabled={addLoading || removeLoading}
              >
                Block
              </Button>
              <Button
                size="sm"
                variant="subtle"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
            </Group>
          </div>
        )}
      </Modal> */}
    </>
  );
}
