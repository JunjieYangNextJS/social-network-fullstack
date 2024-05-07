import { useState } from "react";
import { Modal, Button, Group, NumberInput } from "@mantine/core";

export default function ScheduleLaterModal({
  opened,
  setOpened,
  hours,
  setHours,
}) {
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="How many hours later?"
        withCloseButton={false}
        centered
      >
        <NumberInput
          style={{ marginTop: 15 }}
          //   label="Step on hold"
          //   description="Step the value when clicking and holding the arrows"
          stepHoldDelay={500}
          stepHoldInterval={100}
          value={hours}
          min={0}
          onChange={(val) => setHours(val)}
        />
      </Modal>
    </>
  );
}
