import { useNavigate } from "react-router-dom";
import "./App.css";

const Button = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Button Page</h2>
          <p className="page-subtitle">A simple page with a button.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
          Back to Form
        </button>
      </div>

      <div className="form-card">
        <button type="button" className="btn-primary">
          I am button
        </button>
      </div>
    </div>
  );
};

export default Button;
