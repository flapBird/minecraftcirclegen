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
    expect(start).toHaveValue("#ECE5D8");
    expect(end).toHaveValue("#505052");
    fireEvent.click(screen.getByRole("button", { name: "Reverse gradient colors" }));
    expect(screen.getByRole("textbox", { name: "Start color hex value" })).toHaveValue("#505052");
    expect(screen.getByRole("textbox", { name: "End color hex value" })).toHaveValue("#ECE5D8");

    fireEvent.click(screen.getByRole("button", { name: "Copy block list" }));
    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("1.");
  });

  it("uses selected Minecraft blocks as fixed gradient endpoints", () => {
    render(<GradientGenerator initialOptions={DEFAULT_GRADIENT_OPTIONS} />);

    expect(screen.getByRole("combobox", { name: "Start block" })).toHaveValue("quartz_block");
    expect(screen.getByRole("combobox", { name: "End block" })).toHaveValue("deepslate");
    expect(screen.getAllByText("Quartz Block").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Deepslate").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByRole("combobox", { name: "Start block" }), {
      target: { value: "red_concrete" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "End block" }), {
      target: { value: "yellow_concrete" },
    });

    expect(screen.getAllByText("Red Concrete").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Yellow Concrete").length).toBeGreaterThan(0);
  });
});
