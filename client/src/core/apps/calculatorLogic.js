export const createCalculatorLogic = (set) => ({
  display: "0",
  equation: "",
  prevValue: null,
  operator: null,
  waitingForOperand: false,

  inputDigit: (digit) =>
    set((state) => {
      if (state.display.length >= 9 && !state.waitingForOperand) return state;

      const newDisplay =
        state.waitingForOperand || state.display === "0"
          ? String(digit)
          : state.display + digit;

      return {
        display: newDisplay,
        waitingForOperand: false,
      };
    }),

  inputDot: () =>
    set((state) => {
      if (state.waitingForOperand)
        return { display: "0.", waitingForOperand: false };
      if (!state.display.includes(".")) return { display: state.display + "." };
      return state;
    }),

  clear: () =>
    set({
      display: "0",
      equation: "",
      prevValue: null,
      operator: null,
      waitingForOperand: false,
    }),

  toggleSign: () =>
    set((state) => ({
      display:
        state.display.charAt(0) === "-"
          ? state.display.substr(1)
          : "-" + state.display,
    })),

  inputPercent: () =>
    set((state) => {
      const value = parseFloat(state.display);
      return { display: String(value / 100) };
    }),

  performOperation: (nextOperator) =>
    set((state) => {
      const inputValue = parseFloat(state.display);

      if (state.prevValue == null) {
        return {
          prevValue: inputValue,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      if (state.operator) {
        const currentValue = state.prevValue || 0;
        const newValue = calculate(currentValue, inputValue, state.operator);

        return {
          display: String(newValue).slice(0, 10),
          prevValue: newValue,
          operator: nextOperator,
          waitingForOperand: true,
        };
      }

      return {
        operator: nextOperator,
        waitingForOperand: true,
      };
    }),
});

const calculate = (prev, next, op) => {
  switch (op) {
    case "+":
      return prev + next;
    case "-":
      return prev - next;
    case "×":
      return prev * next;
    case "÷":
      return prev / next;
    default:
      return next;
  }
};
