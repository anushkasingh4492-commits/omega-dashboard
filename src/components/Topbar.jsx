export default function Topbar({ title }) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="user">
        <span>Admin</span>
        <div className="avatar">A</div>
      </div>
    </div>
  );
}