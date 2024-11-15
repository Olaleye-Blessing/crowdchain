import { HomeLink } from "../home-link";
import Pages from "./pages";
import Wallet from "./wallet";
import Hamburger from "./hamburger";
import "./index.css";
import Search from "./search";
import CreateCampaign from "./create-campaign";

const Navbar = () => {
  return (
    <nav className="py-2 border border-border sticky top-0 left-0 z-[49] bg-background shadow-2xl">
      <div className="layout flex items-center justify-between">
        <HomeLink className="mr-1 hidden xs:block" />
        <Hamburger />
        <div className="nav__contents">
          <Pages />
          <Search />
        </div>
        <CreateCampaign />
        <Wallet />
      </div>
    </nav>
  );
};

export default Navbar;
