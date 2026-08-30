import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/about/page";
import PrivacyPage from "@/app/privacy/page";

describe("trust pages", () => {
  it("discloses the active AdSense integration", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Advertising and Google AdSense" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/ca-pub-4183802444188513/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/if advertising .* services are added/i),
    ).not.toBeInTheDocument();
  });

  it("provides substantive project and support information", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", { name: "How the project grew" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Technology behind the site" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Frequently asked questions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("contact@minecraftcirclegen.com")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "public GitHub repository" }),
    ).not.toBeInTheDocument();
  });
});
