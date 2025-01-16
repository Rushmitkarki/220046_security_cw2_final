import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Register from "./Register";
import { BrowserRouter } from "react-router-dom";
import { registerUserApi } from "../../apis/Api";
import { toast } from "react-hot-toast";

// Mock the API and toast
jest.mock("../../apis/Api");
jest.mock("react-hot-toast");

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form elements", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Check for the presence of form fields and the register button
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();

    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    expect(passwordInputs[0]).toBeInTheDocument(); // Password
    expect(passwordInputs[1]).toBeInTheDocument(); // Confirm Password

    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("displays validation errors when form is submitted with empty fields", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Check for validation error messages
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/last name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/username is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/phone number is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // Using findAllByText for password-related errors due to multiple matches
    const passwordErrors = await screen.findAllByText(/password is required/i);
    expect(passwordErrors).toHaveLength(2);
  });

  test("displays error message when passwords do not match", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "johndoe@example.com" },
    });

    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: "password123" } }); // Password
    fireEvent.change(passwordInputs[1], {
      target: { value: "differentpassword" },
    }); // Confirm Password

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Check for the password mismatch error
    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("calls registerUserApi and shows success toast on successful registration", async () => {
    // Mock the API response
    registerUserApi.mockResolvedValueOnce({
      data: { success: true, message: "Registration successful!" },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "johndoe@example.com" },
    });

    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: "password123" } }); // Password
    fireEvent.change(passwordInputs[1], { target: { value: "password123" } }); // Confirm Password

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        phoneNumber: "1234567890",
        email: "johndoe@example.com",
        password: "password123",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Registration successful! Please login to continue."
      );
    });
  });

  test("shows error toast on failed registration", async () => {
    // Mock the API to reject the registration
    registerUserApi.mockRejectedValueOnce(new Error("Registration failed"));

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "johndoe@example.com" },
    });

    const passwordInputs = screen.getAllByPlaceholderText(/password/i);
    fireEvent.change(passwordInputs[0], { target: { value: "password123" } }); // Password
    fireEvent.change(passwordInputs[1], { target: { value: "password123" } }); // Confirm Password

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Registration failed. Please try again."
      );
    });
  });
});
