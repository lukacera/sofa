import React from "react";
import IndividualHomePage from "../components/HomePages/IndividualHomePage";
import { auth } from "@/auth";
import CompanyDashboard from "../components/HomePages/CompanyHomePage";

export default async function Page() {
  
  // Fetch session on the server
  const session = await auth();

  if (session === null || session === undefined) {
  return <span>Loading...</span>;
  }

  if (session.user.role === "company") {
    return <CompanyDashboard />;
  } else {
    return <IndividualHomePage />;
  }
}
