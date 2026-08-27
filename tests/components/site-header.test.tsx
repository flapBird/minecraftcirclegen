import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("keeps the primary desktop choices and groups generators into scalable categories", async () => {
    navigationState.pathname = "/sphere-generator";
    render(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    const primaryLinks = Array.from(navigation.children)
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);

    expect(primaryLinks.map((link) => link.textContent)).toEqual([
      "Circle",
      "House Designs",
      "Blueprints",
    ]);
    expect(primaryLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/house-designs",
      "/house-blueprints",
    ]);

    const tools = navigation.querySelector(".desktop-tools-menu > summary");
    expect(tools).toHaveAttribute("aria-current", "page");
    await userEvent.click(tools!);

    expect(within(navigation).getByRole("heading", { name: "Build & Shape Tools" })).toBeInTheDocument();
    expect(within(navigation).getByRole("heading", { name: "Art & Design Tools" })).toBeInTheDocument();
    expect(within(navigation).getByRole("heading", { name: "Text & Server Tools" })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: /Oval/ })).toHaveAttribute("href", "/oval-generator");
    expect(within(navigation).getByRole("link", { name: /Font/ })).toHaveAttribute("href", "/minecraft-font-generator");
  });

  it("gives Blueprints its own active state", () => {
    navigationState.pathname = "/house-blueprints/7x7-starter-house";
    render(<SiteHeader />);
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });

    expect(within(navigation).getByRole("link", { name: "Blueprints" })).toHaveAttribute("aria-current", "page");
    expect(within(navigation).getByRole("link", { name: "House Designs" })).not.toHaveAttribute("aria-current");
  });

  it("uses a short hover-intent delay for the desktop Tools menu", () => {
    vi.useFakeTimers();

    try {
      render(<SiteHeader />);
      const navigation = screen.getByRole("navigation", { name: "Main navigation" });
      const toolsMenu = navigation.querySelector(".desktop-tools-menu");

      expect(toolsMenu).not.toHaveAttribute("open");
      fireEvent.mouseEnter(toolsMenu!);
      act(() => vi.advanceTimersByTime(259));
      expect(toolsMenu).not.toHaveAttribute("open");

      act(() => vi.advanceTimersByTime(1));
      expect(toolsMenu).toHaveAttribute("open");

      fireEvent.mouseLeave(toolsMenu!);
      act(() => vi.advanceTimersByTime(179));
      expect(toolsMenu).toHaveAttribute("open");

      act(() => vi.advanceTimersByTime(1));
      expect(toolsMenu).not.toHaveAttribute("open");
    } finally {
      vi.useRealTimers();
    }
  });

  it("groups mobile tools and closes the menu after choosing a page", async () => {
    render(<SiteHeader />);
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    await waitFor(() => expect(screen.getByLabelText("Close navigation menu")).toBeInTheDocument());

    const navigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const primaryMobileLinks = Array.from(navigation.children)
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);
    expect(primaryMobileLinks.map((link) => link.textContent)).toEqual([
      "Circle",
      "House Designs",
      "Blueprints",
    ]);

    await userEvent.click(within(navigation).getByText("Tools", { exact: true }));
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(within(navigation).getByRole("heading", { name: "Build & Shape" })).toBeInTheDocument();
    expect(within(navigation).getAllByRole("link").map((link) => link.querySelector("strong")?.textContent ?? link.textContent?.trim())).toEqual([
      "Circle",
      "Oval",
      "Sphere",
      "Dome",
      "Shape",
      "Pixel Art",
      "Map Art",
      "Font",
      "Banner",
      "Text",
      "Gradient",
      "Color Codes",
      "House Designs",
      "Blueprints",
    ]);

    await userEvent.click(within(navigation).getByRole("link", { name: "Circle" }));
    await waitFor(() => expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument());
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("resets the nested Tools section whenever the mobile menu closes", async () => {
    render(<SiteHeader />);
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    const navigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    await userEvent.click(within(navigation).getByText("Tools", { exact: true }));
    expect(within(navigation).getByRole("button", { name: "Tools" })).toHaveAttribute("aria-expanded", "true");
    expect(within(navigation).getByRole("link", { name: /^Oval/ })).toBeVisible();

    await userEvent.click(screen.getByLabelText("Close navigation menu"));
    await userEvent.click(screen.getByLabelText("Open navigation menu"));

    const tools = within(navigation).getByRole("button", { name: "Tools" });
    expect(tools).toHaveAttribute("aria-expanded", "false");
    expect(within(navigation).queryByRole("link", { name: /^Oval/ })).not.toBeInTheDocument();

    await userEvent.click(tools);
    expect(tools).toHaveAttribute("aria-expanded", "true");
    expect(within(navigation).getByRole("link", { name: /^Oval/ })).toBeVisible();
  });
});
