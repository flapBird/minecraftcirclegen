import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

describe("SiteHeader", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/?diameter=31&mode=thick");
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("preserves circle parameters when navigating within the homepage", async () => {
    render(
      <>
        <SiteHeader />
        <div id="how-to-use" />
      </>,
    );
    const navigation = screen.getByRole("navigation", { name: "Main navigation" });
    await userEvent.click(within(navigation).getByRole("link", { name: "How to Use" }));
    expect(window.location.search).toBe("?diameter=31&mode=thick");
    expect(window.location.hash).toBe("#how-to-use");
  });

  it("closes the mobile menu after choosing a section", async () => {
    render(
      <>
        <SiteHeader />
        <div id="faq" />
      </>,
    );
    await userEvent.click(screen.getByLabelText("Open navigation menu"));
    await waitFor(() =>
      expect(screen.getByLabelText("Close navigation menu")).toBeInTheDocument(),
    );
    const navigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    await userEvent.click(within(navigation).getByRole("link", { name: "FAQ" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument(),
    );
  });
});
