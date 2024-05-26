import { useReducer, useEffect } from "react";

const initialState = {
  textInputValue: "",
  numberInputValue: "",
  budget: 2000,
  remaining: 2000,
  spentSoFar: 0,
  expenses: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TEXT_INPUT":
      return { ...state, textInputValue: action.payload };
    case "SET_NUMBER_INPUT":
      return { ...state, numberInputValue: action.payload };
    case "ADD_EXPENSE":
      const expenseAmount = parseFloat(state.numberInputValue);
      const updatedSpentSoFar = state.spentSoFar + expenseAmount;
      const updatedRemaining = state.budget - updatedSpentSoFar;
      const newExpense = {
        id: Date.now(),
        name: state.textInputValue,
        amount: expenseAmount,
      };
      return {
        ...state,
        textInputValue: "",
        numberInputValue: "",
        spentSoFar: updatedSpentSoFar,
        remaining: updatedRemaining,
        expenses: [...state.expenses, newExpense],
      };
    case "DELETE_EXPENSE":
      const updatedExpenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
      const deletedExpense = state.expenses.find(
        (expense) => expense.id === action.payload
      );
      const adjustedSpentSoFar = state.spentSoFar - deletedExpense.amount;
      const adjustedRemaining = state.budget - adjustedSpentSoFar;
      return {
        ...state,
        spentSoFar: adjustedSpentSoFar,
        remaining: adjustedRemaining,
        expenses: updatedExpenses,
      };
    case "LOAD_EXPENSES":
      const expenses = action.payload;
      const spentSoFar = expenses.reduce((total, expense) => total + expense.amount, 0);
      return {
        ...state,
        expenses: expenses,
        spentSoFar: spentSoFar,
        remaining: state.budget - spentSoFar,
      };
    default:
      return state;
  }
};

const BudgetPlanner = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    dispatch({ type: "LOAD_EXPENSES", payload: savedExpenses });
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(state.expenses));
  }, [state.expenses]);

  const handleTextInputChange = (e) => {
    dispatch({ type: "SET_TEXT_INPUT", payload: e.target.value });
  };

  const handleNumberInputChange = (e) => {
    dispatch({ type: "SET_NUMBER_INPUT", payload: e.target.value });
  };

  const handleAddExpense = () => {
    if (state.textInputValue && state.numberInputValue) {
      dispatch({ type: "ADD_EXPENSE" });
    }
  };

  const handleDeleteExpense = (id) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">My Budget Planner</h1>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-100 rounded-lg shadow-md">
            <div className="text-lg font-semibold">Budget</div>
            <div className="text-2xl">Rs. {state.budget}</div>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
            <div className="text-lg font-semibold">Remaining</div>
            <div className="text-2xl">Rs. {state.remaining}</div>
          </div>
          <div className="p-4 bg-red-100 rounded-lg shadow-md">
            <div className="text-lg font-semibold">Spent so far</div>
            <div className="text-2xl">Rs. {state.spentSoFar}</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Expenses</h1>
        <div className="flex flex-col space-y-2">
          {state.expenses.length === 0 ? (
            <div className="text-center">No expenses added yet.</div>
          ) : (
            state.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded shadow-md"
              >
                <div>
                  {expense.name}: Rs. {expense.amount}
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Expenses</h1>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Expense Name"
            value={state.textInputValue}
            onChange={handleTextInputChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount"
            value={state.numberInputValue}
            onChange={handleNumberInputChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="mt-4 p-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700"
          onClick={handleAddExpense}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default BudgetPlanner;
