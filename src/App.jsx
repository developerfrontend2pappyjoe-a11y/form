import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { countries, countriesStates } from "./data/countriesStates";
import { getSavedFormList, saveFormList } from "./utils/formStorage";

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

  const containerStyle = {
    padding: "20px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
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

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>User Form</h2>
        <button type="button" onClick={() => navigate("/info-details")}>
          Info Details
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
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

        <button type="submit">{editingId ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default App;
