import Link from "next/link";
import {
  ChartNoAxesCombined,
  LoaderPinwheel,
  Car,
  Plus,
  ShieldCheck,
  LogOut,
  MessageSquare,
} from "lucide-react";
export const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="navbar-menu">
        <Link href="/dashboard/statistics">
          <span>
            <ChartNoAxesCombined />
            Statistici
          </span>
        </Link>
        <Link href="/dashboard/rims">
          <span>
            <LoaderPinwheel />
            Anunturi jante
          </span>
        </Link>
        <Link href="/dashboard/cars">
          <span>
            <Car />
            Anunturi auto
          </span>
        </Link>
        <Link href="/dashboard/new-add">
          <span>
            <Plus />
            Adauga anunt
          </span>
        </Link>
        <Link href="/dashboard/messages">
          <span>
            <MessageSquare />
            Mesaje
          </span>
        </Link>
        <Link href="/dashboard/admin">
          <span>
            <ShieldCheck />
            Zona administrator
          </span>
        </Link>
        <span>
          <LogOut />
          Deconectare
        </span>
      </nav>
    </div>
  );
};
