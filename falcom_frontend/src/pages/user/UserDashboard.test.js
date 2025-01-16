import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import Profile from "./Profile";
import { getProductCount, pagination, searchProductsApi } from "../../apis/Api";

// Mock the API functions
jest.mock("../../apis/Api");

describe("Profile Component", () => {
  beforeEach(() => {
    // Mocking API responses
    getProductCount.mockResolvedValue({ data: { productCount: 16 } });
    pagination.mockResolvedValue({
      data: {
        products: [
          { _id: "1", name: "Product 1" },
          { _id: "2", name: "Product 2" },
          { _id: "3", name: "Product 3" },
          { _id: "4", name: "Product 4" },
        ],
      },
    });
    searchProductsApi.mockResolvedValue({
      data: {
        products: [{ _id: "5", name: "Search Result" }],
      },
    });
  });

  test("renders Profile component correctly", () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Check if the tabs are rendered
    expect(screen.getByText(/Shop Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/Tyre Age Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();

    // Check if the Shop Now content is displayed by default
    expect(
      screen.getByPlaceholderText(/Search for products.../i)
    ).toBeInTheDocument();
  });

  test("switches between tabs correctly", () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Initially, the Shop Now tab should be active
    expect(screen.getByText(/Available Products/i)).toBeInTheDocument();

    // Click on the Cart tab
    fireEvent.click(screen.getByText(/Cart/i));
    expect(screen.getByText(/Your cart is empty./i)).toBeInTheDocument(); // Assuming Cart is initially empty

    // Click on the Tyre Age Calculator tab
    fireEvent.click(screen.getByText(/Tyre Age Calculator/i));
    expect(screen.getByText(/Tire Age Calculator/i)).toBeInTheDocument();

    // Click on the Profile tab
    fireEvent.click(screen.getByText(/Profile/i));
    expect(screen.getByText(/Your profile./i)).toBeInTheDocument();
  });

  test("handles pagination correctly", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Check that pagination buttons are rendered
    expect(screen.getByText(/Next/i)).toBeInTheDocument();

    // Click the "Next" button to go to the second page
    fireEvent.click(screen.getByText(/Next/i));

    // Check that the products on the second page are rendered
    expect(await screen.findByText(/Product 3/i)).toBeInTheDocument();
  });

  test("searches for products correctly", async () => {
    render(
      <Router>
        <Profile />
      </Router>
    );

    // Enter a search query and click the search button
    fireEvent.change(screen.getByPlaceholderText(/Search for products.../i), {
      target: { value: "Search Query" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    // Check that the search results are displayed
    expect(await screen.findByText(/Search Result/i)).toBeInTheDocument();
  });

  test("logs out correctly", () => {
    // Mock localStorage.removeItem
    const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

    render(
      <Router>
        <Profile />
      </Router>
    );

    // Click the logout button
    fireEvent.click(screen.getByText(/Logout/i));

    // Check that localStorage.removeItem was called with 'token'
    expect(removeItemSpy).toHaveBeenCalledWith("token");
  });
});
