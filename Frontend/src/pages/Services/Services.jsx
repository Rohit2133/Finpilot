import React from "react";
import "./Services.css";

import EmiCalculator from "../../components/EmiCalculator/EmiCalculator";
import FinancialHealth from "../../components/Financial_Score/Financial_score";
import SavingsGoals from "../../components/Saving_Goals/Saving_goal";

const Services = () => {
  return (
    <div className="services-page">
      {/* Header Section */}
      <header className="services-header">
        <h1>Our Financial Services</h1>
        <p>
          Empowering rural communities with simple, reliable, and accessible
          financial tools to help families plan, save, and grow securely.
        </p>
      </header>

      {/* Grid Section */}
      <div className="services-grid">
        <EmiCalculator />
        <FinancialHealth />
        <SavingsGoals />
      </div>
    </div>
  );
};

export default Services;
