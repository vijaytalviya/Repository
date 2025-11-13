import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Loader from "@/components/Loader";

describe("Loader Component", () => {
  it("renders the loader container", () => {
    const { container } = render(<Loader />);
    const loaderContainer = container.querySelector(".loader-container");
    expect(loaderContainer).toBeInTheDocument();
  });

  it("renders the spinning loader", () => {
    render(<Loader />);
    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("loader");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Loader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
