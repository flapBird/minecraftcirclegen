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
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    fireEvent.change(screen.getByRole("slider", { name: "Gradient length slider" }), {
      target: { value: "5" },
    });
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("5 blocks")).toBeInTheDocument();
  });

  it("reverses colors and copies the generated block list", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    const start = screen.getByRole("textbox", { name: "Start color hex value" });
    const end = screen.getByRole("textbox", { name: "End color hex value" });
    expect(start).toHaveValue("#EEE5CF");
    expect(end).toHaveValue("#26352C");
    fireEvent.click(screen.getByRole("button", { name: "Reverse gradient colors" }));
    expect(screen.getByRole("textbox", { name: "Start color hex value" })).toHaveValue("#26352C");
    expect(screen.getByRole("textbox", { name: "End color hex value" })).toHaveValue("#EEE5CF");

    fireEvent.click(screen.getByRole("button", { name: "Copy block list" }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("1.");
  });
});
