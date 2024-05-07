import React from "react";
import NewsCreateForm from "./../../components/Forms/NewsCreateForm";
import useUser from "./../../react-query-hooks/useUser/useUser";

export default function NewsCreate() {
  const { data: user } = useUser();
  return <div>{user?.role === "admin" && <NewsCreateForm />}</div>;
}
