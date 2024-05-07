import React from "react";
import { RangeCalendar } from "@mantine/dates";

export default function CalendarWithRange({ values, setValues }) {
  return (
    <RangeCalendar
      value={values}
      onChange={setValues}
      minDate={new Date("2022-6-1")}
    />
  );
}
