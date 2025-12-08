import React, { useState } from "react";
import "./Saving_goal.css";
import { checkSavingsGoal } from "../../api/backend";

const SavingsGoal = () => {
  const [target, setTarget] = useState("");
  const [months, setMonths] = useState("");
  const [monthlySaving, setMonthlySaving] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!target || !months || !monthlySaving) {
      setResult("⚠ Please fill all the fields.");
      return;
    }

    setLoading(true);

    // Backend API call
    const response = await checkSavingsGoal({
      target: Number(target),
      months: Number(months),
      monthly_saving: Number(monthlySaving)
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="savings-goals">
      <h2>Savings Goal</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Target Amount"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <input
          type="number"
          placeholder="Months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
        />

        <input
          type="number"
          placeholder="Monthly Saving"
          value={monthlySaving}
          onChange={(e) => setMonthlySaving(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check Goal"}
        </button>
      </form>

      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default SavingsGoal;
