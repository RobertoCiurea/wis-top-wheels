import Link from "next/link";
export const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="navbar-menu">
        <Link href="/dashboard/statistics">
          <span>Statistici</span>
        </Link>
        <Link href="/dashboard/rims">
          <span>Anunturi jante</span>
        </Link>
        <Link href="/dashboard/cars">
          <span>Anunturi auto</span>
        </Link>
        <Link href="/dashboard/new-add">
          <span>Adauga anunt</span>
        </Link>
        <Link href="/dashboard/admin">
          <span>Zona administrator</span>
        </Link>
        <span>Deconectare</span>
      </nav>
    </div>
  );
};
