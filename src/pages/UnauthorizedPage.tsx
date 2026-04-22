import { useNavigate } from "react-router-dom";

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <h1>Zugriff nicht erlaubt</h1>
      <p>Du hast keine Berechtigung, diese Seite zu sehen.</p>
      <button onClick={() => navigate("/")}>Zur Startseite</button>
    </div>
  );
}
