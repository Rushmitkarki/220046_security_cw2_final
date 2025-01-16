import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import {
  loginUserApi,
  getUserByGoogleEmail,
  googleLoginApi,
} from "../../apis/Api";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

// Mock the API, toast, and Google Login
jest.mock("../../apis/Api");
jest.mock("react-hot-toast");
jest.mock("jwt-decode");
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global.localStorage, "setItem");
  });

  test("renders login form elements", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Check for the presence of email, password inputs, and login button
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("displays validation errors when form is submitted with empty fields", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Check for validation error messages
    expect(
      await screen.findByText(/email is empty or invalid/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/password is empty/i)).toBeInTheDocument();
  });

  test("displays error message on failed login attempt", async () => {
    // Mock a failed login response
    loginUserApi.mockResolvedValueOnce({
      data: { success: false, message: "Invalid credentials" },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "wrongpassword",
      });
      expect(toast.error).toHaveBeenCalledWith("Unable to locate your account");
    });
  });

  test("redirects on successful login", async () => {
    // Mock a successful login response
    loginUserApi.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Login Successful",
        token: "mockedToken",
        userData: { isAdmin: false },
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "correctpassword",
      });
      expect(toast.success).toHaveBeenCalledWith("Login Successful");
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "mockedToken");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ isAdmin: false })
      );
      // Assuming you use navigate or window.location.href for redirection
      expect(window.location.href).toBe("/profile");
    });
  });

  test("handles Google login success", async () => {
    const token = "mockedGoogleToken";
    const googleId = "googleId123";
    const userMock = { name: "Google User" };

    jwtDecode.mockReturnValue({ sub: googleId });

    GoogleLogin.mockImplementation(({ onSuccess }) => {
      onSuccess({ credential: token });
      return null;
    });

    getUserByGoogleEmail.mockResolvedValue({ status: 200 });
    googleLoginApi.mockResolvedValue({
      status: 201,
      data: {
        token,
        user: userMock,
      },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getUserByGoogleEmail).toHaveBeenCalledWith({ token });
      expect(googleLoginApi).toHaveBeenCalledWith({
        token,
        googleId,
        password: "",
      });
      expect(toast.success).toHaveBeenCalledWith("Login Successful");
      expect(localStorage.setItem).toHaveBeenCalledWith("token", token);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(userMock)
      );
      // Assuming you use navigate or window.location.href for redirection
      expect(window.location.href).toBe("/profile");
    });
  });
});
