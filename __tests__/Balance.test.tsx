import Balance from "@/app/components/Balance/Balance";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

// filepath: src/app/components/Balance/Balance.test.tsx

describe("Balance Component", () => {
  test("renders the Balance component correctly", () => {
    render(<Balance amount={1000} currency="USD" title="Current Balance" />);
    const titleElement = screen.getByText("Current Balance");
    expect(titleElement).toBeInTheDocument();
  });

  test("displays the correct amount and currency", () => {
    render(<Balance amount={1000} currency="USD" title="Current Balance" />);
    const balanceText = screen.getByText("1000 USD");
    expect(balanceText).toBeInTheDocument();
  });

  test("handles negative balances correctly", () => {
    render(<Balance amount={-500} currency="EUR" title="Debt" />);
    const balanceText = screen.getByText("-500 EUR");
    expect(balanceText).toBeInTheDocument();
  });

  test("handles zero balance correctly", () => {
    render(<Balance amount={0} currency="GBP" title="Empty Account" />);
    const balanceText = screen.getByText("0 GBP");
    expect(balanceText).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<Balance amount={1000} currency="USD" title="Current Balance" />);
    const containerElement = document.querySelector(".container");
    const titleElement = document.querySelector(".title");
    const balanceElement = document.querySelector(".balance");

    expect(containerElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(balanceElement).toBeInTheDocument();
  });
});
