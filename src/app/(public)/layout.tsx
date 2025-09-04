import PublicNavbar from "@/components/PublicNavbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
};

export default PublicLayout;
