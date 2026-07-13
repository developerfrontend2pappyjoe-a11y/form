import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedFormList, saveFormList } from "./utils/formStorage";
import "./App.css";

const InfoDetails = () => {
  const navigate = useNavigate();
  const [submittedList, setSubmittedList] = useState(() => getSavedFormList());

  const handleEdit = (entry) => {
    navigate("/", { state: { editEntry: entry } });
  };

  const handleDelete = (id) => {
    const updatedList = submittedList.filter((item) => item.id !== id);
    saveFormList(updatedList);
    setSubmittedList(updatedList);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>User Info</h2>
          <p className="page-subtitle">All submitted user records are shown below.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
          Back to Form
        </button>
      </div>

      {submittedList.length === 0 ? (
        <div className="empty-state">
          No submitted details yet. Go back and submit the form.
        </div>
      ) : (
        <div className="info-grid">
          {submittedList.map((entry) => (
            <div key={entry.id} className="info-card">
              <h3>User Details</h3>

              <p><strong>First Name:</strong> {entry.firstName}</p>
              <p><strong>Last Name:</strong> {entry.lastName}</p>
              <p><strong>Phone:</strong> {entry.phone}</p>
              <p><strong>Email:</strong> {entry.email}</p>
              <p><strong>Gender:</strong> {entry.gender}</p>
              <p><strong>Country:</strong> {entry.country}</p>
              <p><strong>State:</strong> {entry.state}</p>
              <p><strong>Address:</strong> {entry.address}</p>

              <div className="card-actions">
                <button type="button" className="btn-secondary" onClick={() => handleEdit(entry)}>
                  Edit
                </button>
                <button type="button" className="btn-danger" onClick={() => handleDelete(entry.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoDetails;
