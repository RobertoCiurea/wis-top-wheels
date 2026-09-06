"use client";
import { useEffect, useState } from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import "@/app/styles/nav.css";
import "@/app/styles/mobile-menu.css";
import { MenuSearchBar } from "./MenuSearchBar";
import { usePathname } from "next/navigation";
import { EllipsisVertical, LayoutDashboard, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutAction from "../actions/logoutAction";
export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const session = useSession();

  const disableMenuSearchBar = pathname.startsWith("/anunturi");

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isMenuOpen) {
          closeMenu();
        }
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/*NAVIGATION Desktop*/}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="nav-inner">
          <a href="/#" className="nav-logo">
            <Image
              src={Logo}
              alt="WIS Top Wheels Logo"
              preload
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </a>
          <div className="nav-links">
            <Link href="/#about">Despre noi</Link>
            <Link href="/#services">Servicii</Link>

            <Link href="/#contact">Contact</Link>
          </div>
          <div className="nav-cta">
            <a href="tel:+40726547517" className="btn btn-ghost btn-sm">
              📞 Sună acum
            </a>
            <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">
              WhatsApp
            </a>
            <div className="nav-dropdown">
              <button
                className="nav-dropdown__trigger"
                aria-expanded="false"
                aria-haspopup="menu"
              >
                <EllipsisVertical size={24} aria-hidden="true" />
              </button>
              <div className="nav-dropdown__menu" role="menu">
                <Link role="menuitem" href="/dashboard">
                  <div className="nav-drop__menu-item">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link role="menuitem" href="/dashboard/account">
                  <div className="nav-drop__menu-item">
                    <User />
                    <span>Cont </span>
                  </div>
                </Link>
                {session.status === "authenticated" && (
                  <div className="nav-drop__logout">
                    <span className="top-bar"></span>
                    <form action={LogoutAction}>
                      <button
                        type="submit"
                        className="nav-drop__menu-item"
                        role="menuitem"
                      >
                        <LogOut />
                        <span>Delogare</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            className={`nav-toggle ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            id="menuToggle"
            aria-label="Meniu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {!disableMenuSearchBar && <MenuSearchBar />}
      </nav>

      {/*  MOBILE MENU */}
      <div
        className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
        id="mobileMenu"
      >
        <div className="mobile-menu__backdrop" onClick={toggleMenu}></div>
        <aside
          className="mobile-menu__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu mobil"
        >
          <div className="mobile-menu__body">
            <nav className="mobile-links">
              <Link href="/#stock" onClick={toggleMenu}>
                Jante & Anvelope
              </Link>
              <Link href="/#cars" onClick={toggleMenu}>
                Mașini de vânzare
              </Link>
              <Link href="/#about" onClick={toggleMenu}>
                Despre noi
              </Link>
              <Link href="/#contact" onClick={toggleMenu}>
                Contact
              </Link>

              <a href="/dashboard">Zonă administrator</a>
            </nav>
            <div className="mobile-cta mobile-cta--stacked">
              <a
                href="tel:+40726547517"
                className="btn btn-ghost"
                onClick={toggleMenu}
              >
                📞 Sună acum
              </a>
              <a
                href="https://wa.me/40726547517"
                className="btn btn-gold"
                onClick={toggleMenu}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
