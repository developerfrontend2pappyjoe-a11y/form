import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { countries, countriesStates } from "./data/countriesStates";
import { getSavedFormList, saveFormList } from "./utils/formStorage";
import "./App.css";

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

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (location.state?.editEntry) {
      const { id, ...formValues } = location.state.editEntry;
      setFormData(formValues);
      setEditingId(id);
      navigate("/", { replace: true, state: null });
    }
  }, [location.state, navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedList = getSavedFormList();
    const entry = { ...formData, id: editingId || Date.now() };
    const updatedList = editingId
      ? submittedList.map((item) => (item.id === editingId ? entry : item))
      : [...submittedList, entry];

    saveFormList(updatedList);
    setFormData(initialFormData);
    setEditingId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Application Form</h2>
          <p className="page-subtitle">Fill in your details and submit to save them.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => navigate("/info-details")}>
          Info Details
        </button>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="firstName">First Name *</label>
            <input id="firstName" name="firstName" onChange={handleChange} value={formData.firstName} required />
          </div>

          <div className="form-row">
            <label htmlFor="lastName">Last Name *</label>
            <input id="lastName" name="lastName" onChange={handleChange} value={formData.lastName} required />
          </div>

          <div className="form-row">
            <label htmlFor="dob">Date of Birth *</label>
            <input id="dob" type="date" name="dob" onChange={handleChange} value={formData.dob} />
          </div>

          <div className="form-row">
            <label htmlFor="age">Age *</label>
            <input id="age" type="number" name="age" onChange={handleChange} value={formData.age} />
          </div>

          <div className="form-row">
            <label htmlFor="phone">Phone *</label>
            <input id="phone" name="phone" onChange={handleChange} value={formData.phone} required />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" onChange={handleChange} value={formData.email} required />
          </div>

          <div className="form-row">
            <label htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" onChange={handleChange} value={formData.gender}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="country">Country</label>
            <select
              id="country"
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

          <div className="form-row">
            <label htmlFor="state">State</label>
            <select
              id="state"
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

          <div className="form-row">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" onChange={handleChange} value={formData.address}></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
