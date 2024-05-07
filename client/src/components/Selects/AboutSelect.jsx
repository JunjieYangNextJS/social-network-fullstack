import React from "react";
import { Group, Select } from "@mantine/core";

export default function AboutSelect({
  selectValue,
  setSelectValue,
  label,
  data,
  genderValue,
  setGenderValue,
  genderLabel,
  genderData,
  exposedToLabel,
  exposedToValue,
  setExposedToValue,
  exposedToData,
  onlyOne,
}) {
  return (
    <Group spacing="xl">
      <Select
        sx={{ margin: "10px 0", width: genderValue ? 150 : 200 }}
        label={label}
        placeholder="Pick one"
        value={selectValue}
        onChange={setSelectValue}
        data={data}
      />
      {genderValue && (
        <Select
          sx={{ margin: "10px 0", width: genderValue ? 150 : 200 }}
          label={genderLabel}
          placeholder="Pick one"
          value={genderValue}
          onChange={setGenderValue}
          data={genderData}
        />
      )}
      {!onlyOne && (
        <Select
          sx={{ margin: "10px 0", width: genderValue ? 150 : 200 }}
          label={exposedToLabel}
          placeholder="Pick one"
          value={exposedToValue}
          onChange={setExposedToValue}
          data={exposedToData}
        />
      )}
    </Group>
  );
}
