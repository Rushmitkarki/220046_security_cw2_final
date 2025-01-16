import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// import { render, screen } from "@testing-library/react";
// import App from "./App";

// // Mock the Canvas and any 3D-related components from @react-three/fiber and @react-three/drei
// jest.mock("@react-three/fiber", () => ({
//   Canvas: (props) => <div>{props.children}</div>,
// }));

// jest.mock("@react-three/drei", () => ({
//   OrbitControls: () => <div>OrbitControls</div>,
//   Html: (props) => <div>{props.children}</div>,
// }));

// test("App renders without crashing", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
