import { HomeLink } from "../home-link";
import Pages from "./pages";
import Actions from "./actions";
import Wallet from "./wallet";
import Hamburger from "./hamburger";
import "./index.css";

const Navbar = () => {
  return (
    <nav className="py-2 border border-border sticky top-0 left-0 bg-background">
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
