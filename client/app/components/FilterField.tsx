export const FilterField = ({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="filters-field">
      <label htmlFor={name}>{label}</label>
      <div className="filters-control">{children}</div>
    </div>
  );
};
