import React from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSetSecretTellerUsername } from "../../contexts/SecretTellerUsernameContext";

export default function SecretDMButton({ username }) {
  const setSecretTellerUsername = useSetSecretTellerUsername();
  const navigate = useNavigate();

  const handleDMSecretTeller = () => {
    setSecretTellerUsername(username);
    navigate(`/DM/secret-teller`);
  };

  return <Button onClick={() => handleDMSecretTeller()}>SecretDMButton</Button>;
}
