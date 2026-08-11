import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

describe("SiteHeader", () => {
  beforeEach(() => {
    navigationState.pathname = "/";
    window.history.replaceState(null, "", "/?diameter=31&mode=thick");
    Element.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });

  it("shows every generator as a top-level desktop link with Font last", () => {
    navigationState.pathname = "/sphere-generator";
    render(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    const links = within(navigation).getAllByRole("link");
    const labels = links.map((link) => link.textContent);

    expect(labels).toEqual([
      "Circle",
      "Oval",
      "Sphere",
      "Dome",
      "Gradient",
      "Pixel Art",
      "Map Art",
      "Font",
    ]);
    expect(within(navigation).queryByText("More Tools")).not.toBeInTheDocument();
    expect(within(navigation).queryByText("How to Use")).not.toBeInTheDocument();
    expect(within(navigation).queryByText("FAQ")).not.toBeInTheDocument();
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/oval-generator",
      "/sphere-generator",
      "/dome-generator",
      "/minecraft-gradient-generator",
      "/minecraft-pixel-art-generator",
      "/minecraft-map-art-generator",
      "/minecraft-font-generator",
    ]);
    expect(links.every((link) => !link.getAttribute("href")?.includes("#"))).toBe(true);
    expect(within(navigation).getByRole("link", { name: "Sphere" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(navigation).getByRole("link", { name: "Circle" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("closes the mobile menu after choosing a generator", async () => {
    render(
      <>
        <SiteHeader />
        <div id="generator" />
      </>,
    );
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    await waitFor(() =>
      expect(screen.getByLabelText("Close navigation menu")).toBeInTheDocument(),
    );
    const navigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(navigation).getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Circle",
      "Oval",
      "Sphere",
      "Dome",
      "Gradient",
      "Pixel Art",
      "Map Art",
      "Font",
    ]);
    await userEvent.click(within(navigation).getByRole("link", { name: "Circle" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument(),
    );
  });
});
