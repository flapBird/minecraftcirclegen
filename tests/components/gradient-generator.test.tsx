import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GradientGenerator } from "@/components/gradient-generator/gradient-generator";
import { DEFAULT_GRADIENT_OPTIONS } from "@/lib/gradient/gradient-url-state";

describe("GradientGenerator", () => {
  afterEach(() => vi.restoreAllMocks());

  it("keeps the page URL clean while settings change", () => {
    window.history.replaceState(null, "", "/minecraft-gradient-generator");
    const replaceState = vi.spyOn(window.history, "replaceState");
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    fireEvent.change(screen.getByRole("slider", { name: "Gradient length slider" }), {
      target: { value: "5" },
    });

    expect(window.location.pathname).toBe("/minecraft-gradient-generator");
    expect(window.location.search).toBe("");
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("updates the live block list from the draggable length control", () => {
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    expect(screen.getByRole("heading", { name: "Your gradient" })).toBeInTheDocument();
    expect(screen.queryByText("See the transition in context")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Build plan" })).not.toBeInTheDocument();
    const ribbon = screen.getByLabelText(/Continuous gradient from/);
    expect(ribbon.style.getPropertyValue("--gradient-start")).toBe("#1f438c");
    expect(ribbon.style.getPropertyValue("--gradient-end")).toBe("#5ea919");
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    fireEvent.change(screen.getByRole("slider", { name: "Gradient length slider" }), {
      target: { value: "5" },
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("5 blocks · build in order")).toBeInTheDocument();
  });

  it("reverses colors and copies the generated block list", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    fireEvent.click(screen.getByRole("button", { name: "Exact colors" }));

    const start = screen.getByRole("textbox", { name: "Start color hex value" });
    const end = screen.getByRole("textbox", { name: "End color hex value" });
    expect(start).toHaveValue("#1F438C");
    expect(end).toHaveValue("#5EA919");
    fireEvent.click(screen.getByRole("button", { name: "Reverse gradient colors" }));
    expect(screen.getByRole("textbox", { name: "Start color hex value" })).toHaveValue("#5EA919");
    expect(screen.getByRole("textbox", { name: "End color hex value" })).toHaveValue("#1F438C");

    fireEvent.click(screen.getByRole("button", { name: "Copy block list" }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("1.");
  });

  it("uses the searchable visual picker to set fixed Minecraft block endpoints", () => {
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    expect(screen.getByRole("button", { name: "Start block: Lapis Block" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "End block: Lime Concrete" })).toBeInTheDocument();
    expect(screen.getAllByText("Lapis Block").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lime Concrete").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Start block: Lapis Block" }));
    expect(screen.getByRole("dialog", { name: "Pick a Minecraft block" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Color blocks" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search blocks" }), {
      target: { value: "red concrete" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Select Red Concrete" }));

    fireEvent.click(screen.getByRole("button", { name: "End block: Lime Concrete" }));
    fireEvent.click(screen.getByRole("button", { name: "Color blocks" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search blocks" }), {
      target: { value: "yellow" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Select Yellow Concrete" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start block: Red Concrete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "End block: Yellow Concrete" })).toBeInTheDocument();
    expect(screen.getAllByText("Red Concrete").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Yellow Concrete").length).toBeGreaterThan(0);
  });
});
