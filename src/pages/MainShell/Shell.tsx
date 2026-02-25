import MainShell from "./MainShell";
import { Outlet } from "react-router";

export function AdminShell() {
  return (

    <MainShell title={"Admin"}>
    
      <Outlet />
    
    </MainShell>
  );
}

export function DashboardShell() {
  return (
    
    <MainShell title={"Dashboard"}>
    
      <Outlet />
    
    </MainShell>
  
);

}
