import logo from "../../img/logo.png";
import "./Header.scss";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <Link to={"/"}>
        <img src={logo} alt="logo" className="logo" />
      </Link>
    </header>
  );
};

export default Header;
