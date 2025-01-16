import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TyreAgeCalculator from "./TyreAgeCalculator";

describe("TyreAgeCalculator Component", () => {
  test("renders the TyreAgeCalculator component correctly", () => {
    render(<TyreAgeCalculator />);

    // Check for the presence of the title and input field
    expect(screen.getByText(/Tire Age Calculator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter 4 Digit Code/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. 1522/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate/i)).toBeInTheDocument();
  });

  test("shows an error message for invalid input", () => {
    render(<TyreAgeCalculator />);

    // Input an invalid code (less than 4 digits)
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1522/i), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByText(/Calculate/i));

    // Check for the error message
    expect(
      screen.getByText(/Please enter a valid 4-digit code/i)
    ).toBeInTheDocument();
  });

  test("shows an error message for non-numeric input", () => {
    render(<TyreAgeCalculator />);

    // Input a non-numeric code
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1522/i), {
      target: { value: "abcd" },
    });
    fireEvent.click(screen.getByText(/Calculate/i));

    // Check for the error message
    expect(
      screen.getByText(/Please enter a valid 4-digit code/i)
    ).toBeInTheDocument();
  });

  test("calculates and displays the correct dates for a valid code", () => {
    render(<TyreAgeCalculator />);

    // Input a valid code (e.g., 1522 for the 15th week of 2022)
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1522/i), {
      target: { value: "1522" },
    });
    fireEvent.click(screen.getByText(/Calculate/i));

    // Check that the manufacture date and replacement date are displayed
    expect(screen.getByText(/Tire Manufactured on:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Start Consider Replacing on:/i)
    ).toBeInTheDocument();
  });

  test("does not display results when an error is shown", () => {
    render(<TyreAgeCalculator />);

    // Input an invalid code and calculate
    fireEvent.change(screen.getByPlaceholderText(/e.g. 1522/i), {
      target: { value: "12" },
    });
    fireEvent.click(screen.getByText(/Calculate/i));

    // Check that no results are displayed
    expect(
      screen.queryByText(/Tire Manufactured on:/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Start Consider Replacing on:/i)
    ).not.toBeInTheDocument();
  });
});
