import React, { useState, useEffect } from "react";
import "./Header.css";

const menuItems = [
  { label: "HOME", href: "home", key: "home" },
  { label: "WORKS", href: "works", key: "works" },
  { label: "VISUAL GALLERY", href: "visual-gallery", key: "visual-gallery" },
  { label: "ABOUT", href: "about", key: "about" },
];

function Header() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // Simple scrollspy logic based on section offsetTop
      const sections = menuItems.map(item => document.querySelector(item.href));
      const scrollPos = window.scrollY + 100;
      let found = "home";
      for (let i = 0; i < sections.length; i++) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          found = menuItems[i].key;
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <nav className="nav-menu">
          <ul>
            {menuItems.map(item => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className={active === item.key ? "active" : ""}
                  onClick={() => setActive(item.key)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
