"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LogoutAction from "@/app/actions/logoutAction";
import {
  ChartNoAxesCombined,
  LoaderPinwheel,
  Car,
  Plus,
  ShieldCheck,
  LogOut,
  MessageSquare,
  LayoutDashboard,
  ChevronDown,
  UserRound,
} from "lucide-react";

const navigationItems = [
  {
    href: "/dashboard/statistics",
    label: "Statistici",
    icon: ChartNoAxesCombined,
  },
  { href: "/dashboard/rims", label: "Anunturi jante", icon: LoaderPinwheel },
  { href: "/dashboard/cars", label: "Anunturi auto", icon: Car },
  { href: "/dashboard/new-add", label: "Adauga anunt", icon: Plus },
  { href: "/dashboard/messages", label: "Mesaje", icon: MessageSquare },
  { href: "/dashboard/admin", label: "Zona administrator", icon: ShieldCheck },
  { href: "/dashboard/account", label: "Contul meu", icon: UserRound },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(pathname);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const activeLabel =
    navigationItems.find(
      ({ href }) => activeItem === href || activeItem.startsWith(`${href}/`),
    )?.label || "Dashboard";

  const ActiveIcon =
    navigationItems.find(
      ({ href }) => activeItem === href || activeItem.startsWith(`${href}/`),
    )?.icon || LayoutDashboard;

  return (
    <div className="sidebar-shell">
      <aside
        className={`sidebar ${expanded ? "expanded" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        aria-label="Sidebar navigare"
      >
        <div className="sidebar-head">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">
              <LayoutDashboard size={18} />
            </span>
            <span className="sidebar-brand-text">Dashboard</span>
          </div>
        </div>

        <div className="mobile-nav-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="mobile-nav-trigger"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
          >
            <span className="mobile-nav-trigger__content">
              <span className="mobile-nav-trigger__icon">
                <ActiveIcon size={16} />
              </span>
              <span className="mobile-nav-trigger__label">{activeLabel}</span>
            </span>
            <ChevronDown
              size={16}
              className={`mobile-nav-chevron ${mobileOpen ? "open" : ""}`}
            />
          </button>

          <div className={`mobile-nav-menu ${mobileOpen ? "open" : ""}`}>
            {navigationItems.map(({ href, label, icon: Icon }) => {
              const isActive =
                activeItem === href || activeItem.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActiveItem(href);
                    setMobileOpen(false);
                  }}
                >
                  <span className="mobile-nav-item__icon">
                    <Icon size={16} />
                  </span>
                  <span>{label}</span>
                </Link>
              );
            })}

            <form
              action={LogoutAction}
              className="mobile-nav-form"
              onSubmit={() => {
                setActiveItem("/dashboard");
                setMobileOpen(false);
              }}
            >
              <button type="submit" className="mobile-nav-item">
                <span className="mobile-nav-item__icon">
                  <LogOut size={16} />
                </span>
                <span>Deconectare</span>
              </button>
            </form>
          </div>
        </div>

        <nav className="navbar-menu" aria-label="Navigare dashboard">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              activeItem === href || activeItem.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  setActiveItem(href);
                  setExpanded(false);
                  setMobileOpen(false);
                }}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="nav-label">{label}</span>
              </Link>
            );
          })}

          <form
            action={LogoutAction}
            className="logout-form"
            onSubmit={() => {
              setActiveItem("/dashboard");
              setExpanded(false);
              setMobileOpen(false);
            }}
          >
            <button type="submit" className="nav-link">
              <span className="nav-icon" aria-hidden="true">
                <LogOut size={18} />
              </span>
              <span className="nav-label">Deconectare</span>
            </button>
          </form>
        </nav>
      </aside>
    </div>
  );
};
