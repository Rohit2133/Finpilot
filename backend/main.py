from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel
import uvicorn # type: ignore

from model import answer_question
from functions import financial_health_score, calculate_emi, savings_goal


app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str


@app.post("/ask")
async def ask(payload: AskRequest):
    try:
        answer = answer_question(payload.question)

        if not answer or answer.strip() == "":
            answer = "I am here to help! Please try asking in another way."

        return {"answer": answer}

    except Exception as e:
        return {"answer": f"Server error: {str(e)}"}


# NEW: Financial Health Score API
class HealthInput(BaseModel):
    income: float
    expenses: float
    savings: float
    debt: float = 0


@app.post("/financial-health")
async def api_financial_health(payload: HealthInput):
    result = financial_health_score(
        payload.income, payload.expenses, payload.savings, payload.debt
    )
    return {"result": result}


# ------------------------------
# NEW: EMI Calculator API
# ------------------------------
class EmiInput(BaseModel):
    principal: float
    rate: float
    years: float


@app.post("/calculate-emi")
async def api_calculate_emi(payload: EmiInput):
    result = calculate_emi(payload.principal, payload.rate, payload.years)
    return {"emi": result}


# ------------------------------
# NEW: Savings Goal API
# ------------------------------
class SavingsInput(BaseModel):
    target: float
    months: int
    monthly_saving: float


@app.post("/savings-goal")
async def api_savings_goal(payload: SavingsInput):
    result = savings_goal(payload.target, payload.months, payload.monthly_saving)
    return {"result": result}


@app.get("/")
def root():
    return {"message": "FinPilot Backend Running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
