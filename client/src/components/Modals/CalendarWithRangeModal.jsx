import { useState } from "react";
import { Modal, Button, Group, NumberInput } from "@mantine/core";
import CalendarWithRange from "./../Calanders/CalendarWithRange";

export default function CalendarWithRangeModal({
  opened,
  setOpened,
  values,
  setValues,
}) {
  //   const handleClose = () => {
  //     setOpened(false);
  //     setValues([new Date("2022-6-1"), new Date("2022-6-22")]);
  //   };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Please select two dates"
        withCloseButton={false}
        centered
      >
        <CalendarWithRange values={values} setValues={setValues} />
        {/* <Group>
          <Button onClick={() => setOpened(false)}>Confirm</Button>
          <Button onClick={() => handleClose()}>Cancel</Button>
        </Group> */}
      </Modal>
    </>
  );
}
