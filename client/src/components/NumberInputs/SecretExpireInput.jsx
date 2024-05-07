import React, { useState } from "react";
import { NumberInput, Group, Center } from "@mantine/core";

export default function SecretExpireInput({
  setDay,
  day,
  setHour,
  hour,
  setMinute,
  minute,
}) {
  return (
    <NumberInput
      value={day}
      onChange={(val) => setDay(val)}
      min={1}
      max={999}
      label="This will expire in how many days?"
      stepHoldDelay={500}
      stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
    />
  );
}

/* <NumberInput
        value={hour}
        onChange={(val) => setHour(val)}
        min={0}
        max={23}
        hideControls
      />
      <NumberInput
        type="number"
        value={minute}
        onChange={(val) => setMinute(val)}
        min={0}
        max={59}
        hideControls
      /> */
