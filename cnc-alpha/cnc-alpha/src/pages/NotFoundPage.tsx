import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>Seite nicht gefunden</h1>
      <p>Die angeforderte Seite existiert nicht.</p>
      <button onClick={() => navigate("/")}>Zur Startseite</button>
    </div>
  );
}
