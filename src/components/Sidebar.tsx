import React, { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { ReactComponent as Overview } from "../assets/icons/overview.svg";
import { ReactComponent as Invest } from "../assets/icons/invest.svg";
import { ReactComponent as History } from "../assets/icons/history.svg";
import { ReactComponent as Statistics } from "../assets/icons/statistics.svg";
import {
  FaBars
} from "react-icons/fa";

import "./Sidebar.scss";

type Props = {
  address: string | undefined;
  name: string;
};
const Sidebar = (props: Props) => {
    const displayAddress = `${props.address ?? ""}`;
    const trunckatedAddress = `${displayAddress?.slice(0, 7) ?? ""}...${displayAddress?.slice(-4) ?? ""}`;
    const displayName = `${props.name?.slice(0, 10) ?? ""}`;

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`container ${isOpen ? 'open' : 'closed'}`}>
    <div className="toggle-button">
          <FaBars size={30} onClick={toggle} />
      </div>
      <div className="top-container">
        <button className="adress-button">
          <div>{trunckatedAddress}</div>
        </button>
        <div className="welcome-message">Welcome to {displayName}</div>
        <div className="description">Your assets are safe on-chain</div>
        <button className="whatnew-button">
          <div>What's new</div>
        </button>
      </div>
      <div className="main-container">
        <ul className="list-routes">
            <Link to="/Home">
              <Overview />
              Overview
            </Link>
            <Link to="/Invest">
              <Invest />
              Invest
            </Link>
            <Link to="/">
              <History />
              History
            </Link>
            <Link to="/">
              <Statistics />
              Statistics
            </Link>
        </ul>
      </div>
      <div className="bottom-container">
        <button className="contact-button">
          <div>Contact us</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;