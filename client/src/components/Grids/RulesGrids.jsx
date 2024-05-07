import React from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  useMantineTheme,
  Divider,
  List,
} from "@mantine/core";
import { Ruler2 } from "tabler-icons-react";

export default function RulesGrids() {
  const theme = useMantineTheme();

  const rules = [
    "Please be open-minded and respectful",
    "No spreading hate",
    "No spams or advertisements",
    "No harassment of any kind",
    "No promoting violent behaviors",
    "No impersonation or plagiarism",
    "Please provide trustworthy source when sharing news",
  ];

  return (
    <Card shadow="xl" p="lg" sx={{ width: 300 }}>
      <div style={{ marginBottom: 12 }}>
        <Group spacing={2}>
          <Ruler2 strokeWidth={1} size={18} />
          <Text weight={500} size="md">
            Rules
          </Text>
        </Group>
      </div>
      <List type="ordered" spacing="sm">
        {rules.map((el, i) => (
          <List.Item key={i} sx={{ fontSize: "14px" }}>
            {el}
            <Divider />
          </List.Item>
        ))}
      </List>
    </Card>
  );
}
