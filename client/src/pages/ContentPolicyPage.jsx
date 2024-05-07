import { Container, Group, Text, Title } from "@mantine/core";
import React from "react";

export default function ContentPolicyPage() {
  const rules = [
    {
      title: "Rule 1",
      description:
        "1. Please be open-minded and respectful. Respect people's opinions unless offensive. Behave the way you behave in real life.",
    },
    {
      title: "Rule 2",
      description: "2. Spreading hate is not allowed from anyone.",
    },
    {
      title: "Rule 3",
      description:
        "3. Spamming or advertising from third party are prohibited since they are considered as an act of ruining user experience.",
    },
    {
      title: "Rule 4",
      description:
        "4. Harassments and doxing are not allowed. We always make sure people would feel safe.",
    },
    {
      title: "Rule 5",
      description: "5. Violent behaviors or threats are not allowed.",
    },
    {
      title: "Rule 6",
      description:
        "6. No impersonation or plagiarism. Impersonation can harm others more than you can think of. Plagiarizing people's work is also an act of disrespect.",
    },
    {
      title: "Rule 7",
      description:
        "7. Misleading or wrong information can be harmful to other users. Please provide trustworthy source when sharing news.",
    },
  ];

  return (
    <div style={{ paddingTop: 100 }}>
      <Container>
        <strong>
          <span style={{ lineHeight: "22.5px", fontSize: 26 }}>
            CONTENT POLICY
          </span>
        </strong>
        <div
          style={{
            paddingTop: 50,
            display: "flex",
            flexDirection: "column",
            gap: 30,
          }}
        >
          <Text size="lg" weight={500}>
            Our goal is to ensure people in our community can always feel safe
            and respected. In order to protect ourselves better, we have set a
            few rules that apply to everyone at Priders.net.
          </Text>

          <Text size="lg" weight={500}>
            Remember when you find someone breaking the rules, please report
            them. We will take actions accordingly. Actions include but not
            limited to: removal of content, warning them nicely, adding
            restrictions to their account or banning for any number of days. We
            thank you for protecting yourself and our community.
          </Text>

          <div style={{ paddingBottom: 100 }}>
            {rules.map(({ title, description }) => (
              <Text key={title} size="lg" weight={400} sx={{ marginTop: 40 }}>
                {description}
              </Text>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
