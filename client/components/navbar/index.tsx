import { HomeLink } from "../home-link";
import Pages from "./pages";
import Actions from "./actions";
import Wallet from "./wallet";
import Hamburger from "./hamburger";
import "./index.css";

const Navbar = () => {
  return (
    <nav className="py-2 relative border border-border">
      <div className="layout flex items-center justify-between">
        <HomeLink />
        <Hamburger />
        <div className="nav__contents">
          <Pages />
          <Actions />
          <Wallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
