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

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index);

const parseDob = (dob) => {
  if (!dob) {
    return { month: "", day: "", year: "" };
  }

  const [year, month, day] = dob.split("-");
  return {
    month: month || "",
    day: day || "",
    year: year || "",
  };
};

const getDaysInMonth = (month, year) => {
  if (!month || !year) {
    return 31;
  }

  return new Date(Number(year), Number(month), 0).getDate();
};

const buildDob = ({ month, day, year }) => {
  if (!month || !day || !year) {
    return "";
  }

  return `${year}-${month}-${day}`;
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

  const { month: dobMonth, day: dobDay, year: dobYear } = parseDob(formData.dob);
  const daysInMonth = getDaysInMonth(dobMonth, dobYear);
  const dayOptions = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  const handleDobChange = (part, value) => {
    const currentDob = parseDob(formData.dob);
    const updatedDob = { ...currentDob, [part]: value };

    if (updatedDob.day && Number(updatedDob.day) > getDaysInMonth(updatedDob.month, updatedDob.year)) {
      updatedDob.day = "";
    }

    setFormData({
      ...formData,
      dob: buildDob(updatedDob),
    });
  };

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
            <label>Date of Birth *</label>
            <div className="dob-selects">
              <div className="dob-field">
                <label htmlFor="dobMonth">Month</label>
                <select
                  id="dobMonth"
                  value={dobMonth}
                  onChange={(e) => handleDobChange("month", e.target.value)}
                  required
                >
                  <option value="">Select Month</option>
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dob-field">
                <label htmlFor="dobDay">Day</label>
                <select
                  id="dobDay"
                  value={dobDay}
                  onChange={(e) => handleDobChange("day", e.target.value)}
                  required
                  disabled={!dobMonth || !dobYear}
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((day) => {
                    const dayValue = String(day).padStart(2, "0");
                    return (
                      <option key={dayValue} value={dayValue}>
                        {day}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="dob-field">
                <label htmlFor="dobYear">Year</label>
                <select
                  id="dobYear"
                  value={dobYear}
                  onChange={(e) => handleDobChange("year", e.target.value)}
                  required
                >
                  <option value="">Select Year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
