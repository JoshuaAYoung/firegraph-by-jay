import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="navBarContainer">
      <NavLink to="/" className="logoLink">
        <img
          src="/assets/firing-graph-logo.svg"
          alt="firing graph logo"
          className="mainLogo"
        />
        <h1 className="navName">
          FireGraph <span className="navNameSmall">by Jay Klay Pots</span>
        </h1>
      </NavLink>
    </div>
  );
};

export default Header;
