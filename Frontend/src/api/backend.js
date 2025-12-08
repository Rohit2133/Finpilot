const BASE_URL = "http://127.0.0.1:8000"
export async function askFinPilot(question) {
  try {
    const res = await fetch(`${BASE_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (data.answer && data.answer.trim() !== "") {
      return data.answer;
    }

    return "I am here to help! Please try asking differently.";

  } catch (error) {
    return "Unable to connect to the server. Please try again.";
    }
} 
// ------------------------------
// FINANCIAL HEALTH SCORE
// ------------------------------
export async function getFinancialHealthScore(payload) {
  const res = await fetch(`${BASE_URL}/financial-health`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()).result;
}

// ------------------------------
// EMI CALCULATOR
// ------------------------------
export async function calculateEMI(payload) {
  const res = await fetch(`${BASE_URL}/calculate-emi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()).emi;
}

// ------------------------------
// SAVINGS GOAL
// ------------------------------
export async function checkSavingsGoal(payload) {
  const res = await fetch(`${BASE_URL}/savings-goal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()).result;
}
