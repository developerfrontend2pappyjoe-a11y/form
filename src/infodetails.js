import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedFormList, saveFormList } from "./utils/formStorage";

const cardStyle = {
  width: "100%",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(56, 22, 119, 0.09)",
  height: "fit-content",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  padding: "20px",
};

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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 20px 0" }}>
        <h2>Info Details</h2>
        <button onClick={() => navigate("/")}>Back to Form</button>
      </div>

      {submittedList.length === 0 ? (
        <p style={{ padding: "20px" }}>No submitted details yet. Go back and submit the form.</p>
      ) : (
        <div style={gridStyle}>
          {submittedList.map((entry) => (
            <div key={entry.id} style={cardStyle}>
              <h3>User Details</h3>

              <p><strong>First Name:</strong> {entry.firstName}</p>
              <p><strong>Last Name:</strong> {entry.lastName}</p>
              <p><strong>Phone:</strong> {entry.phone}</p>
              <p><strong>Email:</strong> {entry.email}</p>
              <p><strong>Gender:</strong> {entry.gender}</p>
              <p><strong>Country:</strong> {entry.country}</p>
              <p><strong>State:</strong> {entry.state}</p>
              <p><strong>Address:</strong> {entry.address}</p>

              <div style={{ marginTop: "15px" }}>
                <button onClick={() => handleEdit(entry)} style={{ marginRight: "10px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(entry.id)}>
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
