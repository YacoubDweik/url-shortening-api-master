"use client";

import { useState } from "react";
import Link from "next/link";

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <button className={`main-header-icon ${isExpanded ? "active" : ""}`} onClick={() => setIsExpanded((prev) => !prev)}>
        <span className="icon-line"></span>
        <span className="icon-line"></span>
        <span className="icon-line"></span>
      </button>
      <nav className={`container main-nav ${isExpanded ? "active" : ""}`}>
        <ul className="main-header-list-one">
          <li className="list-item">
            <Link href="#">Features</Link>
          </li>
          <li className="list-item">
            <Link href="#">Prices</Link>
          </li>
          <li className="list-item">
            <Link href="#">Resources</Link>
          </li>
        </ul>
        <ul className="main-header-list-two">
          <li className="list-item">
            <Link href="#">Login</Link>
          </li>
          <li className="list-btn">
            <Link href="#">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
