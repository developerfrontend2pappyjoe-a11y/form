import React, { useState } from "react";
import { countries, countriesStates } from "./data/countriesStates";

const STORAGE_KEY = "userFormData";

const initialFormData = {
  firstName: "",
  lastName: "",
  dob: "",
  age: "",
  phone: "",
  email: "",
  gender: "",
  country: "",
  state: "",
  address: "",
  departments: [],
};

const getSavedFormData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [submittedData, setSubmittedData] = useState(() => getSavedFormData());

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setFormData({ ...formData, country: value, state: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const availableStates = formData.country
    ? countriesStates[formData.country] || []
    : [];

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedDepartments = [...formData.departments];

    if (checked) {
      updatedDepartments.push(value);
    } else {
      updatedDepartments = updatedDepartments.filter(dep => dep !== value);
    }

    setFormData({ ...formData, departments: updatedDepartments });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setSubmittedData(formData);
  };

  const handleEdit = () => {
    setFormData(submittedData); // load back into form
    setSubmittedData(null);
  };

  const handleDelete = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSubmittedData(null);
  };

  const containerStyle = {
    display: "flex",
    gap: "40px",
    padding: "20px",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  const labelStyle = {
    width: "150px",
    fontWeight: "bold",
  };

  const inputStyle = {
    flex: 1,
  };

  const cardStyle = {
    width: "300px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(56, 22, 119, 0.09)",
    height: "fit-content",
  };

  return (
    <div style={containerStyle}>

      {/* LEFT SIDE FORM (UNCHANGED) */}
      <div style={{ width: "500px" }}>
        <h2>User Form</h2>
        <form onSubmit={handleSubmit}>

          <div style={rowStyle}>
            <label style={labelStyle}>First Name *</label>
            <input style={inputStyle} name="firstName" onChange={handleChange} value={formData.firstName} required />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Last Name *</label>
            <input style={inputStyle} name="lastName" onChange={handleChange} value={formData.lastName} required />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Date of Birth *</label>
            <input style={inputStyle} type="date" name="dob" onChange={handleChange} value={formData.dob} />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Age *</label>
            <input style={inputStyle} type="number" name="age" onChange={handleChange} value={formData.age} />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle} name="phone" onChange={handleChange} value={formData.phone} required />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} name="email" onChange={handleChange} value={formData.email} required />
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Gender *</label>
            <select style={inputStyle} name="gender" onChange={handleChange} value={formData.gender}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Country</label>
            <select
              style={inputStyle}
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>State</label>
            <select
              style={inputStyle}
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!formData.country}
            >
              <option value="">
                {formData.country ? "Select State" : "Select Country first"}
              </option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Address</label>
            <textarea style={inputStyle} name="address" onChange={handleChange} value={formData.address}></textarea>
          </div>

        

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* RIGHT SIDE CARD */}
      {submittedData && (
        <div style={cardStyle}>
          <h3>User Details</h3>

          <p><strong>First Name:</strong> {submittedData.firstName}</p>
          <p><strong>Last Name:</strong> {submittedData.lastName}</p>
          <p><strong>Phone:</strong> {submittedData.phone}</p>
          <p><strong>Country:</strong> {submittedData.country}</p>
          <p><strong>State:</strong> {submittedData.state}</p>

          <div style={{ marginTop: "15px" }}>
            <button onClick={handleEdit} style={{ marginRight: "10px" }}>
              Edit
            </button>
            <button onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;