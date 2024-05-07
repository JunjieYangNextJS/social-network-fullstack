import React from "react";
import { Chips, Chip } from "@mantine/core";

function ReusableChips({ multiple, setValue, value, chipsArray }) {
  return (
    <Chips multiple={multiple} value={value} onChange={setValue}>
      {chipsArray.map((chip) => (
        <Chip key={chip} value={chip}>
          {chip}
        </Chip>
      ))}
    </Chips>
  );
}

export default ReusableChips;
