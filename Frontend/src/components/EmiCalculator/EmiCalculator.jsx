import React, { useState } from "react";
import "./EmiCalculator.css";
import { calculateEMI } from "../../api/backend";

const EmiCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [emi, setEmi] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!principal || !rate || !years) {
      setEmi("⚠ Please fill all the fields.");
      return;
    }

    setLoading(true);

    // Call backend EMI API
    const result = await calculateEMI({
      principal: Number(principal),
      rate: Number(rate),
      years: Number(years),
    });

    setEmi(`Your monthly EMI is ₹${result}`);
    setLoading(false);
  };

  return (
    <div className="emi-calculator">
      <h2>EMI Calculator</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Principal Amount"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />

        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Loan Tenure (Years)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {emi && <p className="result">{emi}</p>}
    </div>
  );
};

export default EmiCalculator;
