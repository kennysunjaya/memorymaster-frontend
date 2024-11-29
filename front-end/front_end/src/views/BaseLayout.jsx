import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function BaseLayout() {
  return (
    <>
      <div id="homediv">
        <Nav />
        <Outlet />
      </div>
    </>
  );
}
