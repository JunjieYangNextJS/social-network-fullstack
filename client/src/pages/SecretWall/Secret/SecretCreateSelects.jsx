import React from "react";
import { Group, MultiSelect, Select } from "@mantine/core";

export default function SecretCreateSelects({
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
    <Group spacing="xl" align="flex-start">
      <MultiSelect
        sx={{ margin: "10px 0", width: genderValue ? 150 : 200 }}
        label={label}
        placeholder="Default to Every"
        value={selectValue}
        onChange={setSelectValue}
        data={data}
      />
      {genderValue && (
        <MultiSelect
          sx={{ margin: "10px 0", width: genderValue ? 150 : 200 }}
          label={genderLabel}
          placeholder="Default to Every"
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
