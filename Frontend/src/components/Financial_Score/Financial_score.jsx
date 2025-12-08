import React, { useState } from "react";
import "./Financial_score.css";
import { getFinancialHealthScore } from "../../api/backend";

const FinancialHealth = () => {
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [debt, setDebt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!income || !expenses || !savings) {
      setResult("⚠ Please fill Income, Expenses, and Savings.");
      return;
    }

    setLoading(true);

    // Backend API call
    const response = await getFinancialHealthScore({
      income: Number(income),
      expenses: Number(expenses),
      savings: Number(savings),
      debt: debt ? Number(debt) : 0,
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="health-score">
      <h2>Financial Health Score</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />

        <input
          type="number"
          placeholder="Expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
        />

        <input
          type="number"
          placeholder="Savings"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
        />

        <input
          type="number"
          placeholder="Debt (Optional)"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {result && <p className="result">{result}</p>}
    </div>
  );
};

export default FinancialHealth;
