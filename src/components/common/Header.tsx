import logo from "../../img/logo.png";
import "./Header.scss";
import { ROOT_URL } from "../../shared/constants/openmrs";

const Header = () => {
  return (
    <header className="header">
      <a href={ROOT_URL}>
        <img src={logo} alt="logo" className="logo" />
      </a>
    </header>
  );
};

export default Header;
