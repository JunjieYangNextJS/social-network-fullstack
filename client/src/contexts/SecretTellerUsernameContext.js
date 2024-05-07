import React, { useContext, useState, useEffect } from "react";
import backendApi from "../utility/backendApi";
import axios from "axios";
import Cookies from "js-cookie";

// create custom context
const SecretTellerUsernameContext = React.createContext();

const SetSecretTellerUsernameContext = React.createContext();

// export useable functions to child
export function useSecretTellerUsername() {
  return useContext(SecretTellerUsernameContext);
}

export function useSetSecretTellerUsername() {
  return useContext(SetSecretTellerUsernameContext);
}

// export to _app.js
export function SecretTellerUsernameProvider({ children }) {
  const [secretTellerUsername, setSecretTellerUsername] = useState("");

  // being returned for AccountProvider(main) function
  return (
    <SecretTellerUsernameContext.Provider value={secretTellerUsername}>
      <SetSecretTellerUsernameContext.Provider value={setSecretTellerUsername}>
        {children}
      </SetSecretTellerUsernameContext.Provider>
    </SecretTellerUsernameContext.Provider>
  );
}
