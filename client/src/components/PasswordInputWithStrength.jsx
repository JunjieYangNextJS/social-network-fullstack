import { useState } from "react";
import { Check, X } from "tabler-icons-react";
import { PasswordInput, Progress, Text, Popover, Box } from "@mantine/core";

function PasswordRequirement({ meets, label }) {
  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <Check size={14} /> : <X size={14} />} <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function PasswordInputWithStrength({ value, setValue, label }) {
  const [popoverOpened, setPopoverOpened] = useState(false);

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <div style={{ maxWidth: 340, margin: "auto" }}>
      <Popover
        opened={popoverOpened}
        position="bottom"
        width="target"
        transition="pop"
      >
        <Popover.Target>
          <div
            onFocusCapture={() => setPopoverOpened(true)}
            onBlurCapture={() => setPopoverOpened(false)}
          >
            <PasswordInput
              required
              label={label || "Password"}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          </div>
        </Popover.Target>
        <Popover.Dropdown>
          <Progress
            color={color}
            value={strength}
            size={5}
            style={{ marginBottom: 10 }}
          />
          <PasswordRequirement
            label="Includes at least 6 characters"
            meets={value.length > 5}
          />
          {checks}
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}
