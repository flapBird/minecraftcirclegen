import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { renderPixelText } from "@/lib/font/pixel-font";
import { ShapeGenerator } from "@/components/shape-generator/shape-generator";
import { EnchantingTableTranslator } from "@/components/enchanting-table-translator/enchanting-table-translator";
import { GeometryGenerator } from "@/components/geometry-generator/geometry-generator";
import { parseGeometryUrl } from "@/lib/geometry/geometry-url-state";

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  window.history.replaceState(null, "", "/");
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

it("reproduces unbounded font input and oversized canvas dimensions", () => {
  render(<FontGenerator />);
  expect(screen.getByRole("textbox", { name: "Your text" })).not.toHaveAttribute("maxlength");
  const plan = renderPixelText({ text: "A".repeat(500), letterSpacing: 1, lineSpacing: 2, shadow: true });
  expect((plan.width + 4) * 12).toBe(36048);
});

it("reproduces a polygon with a hidden height inherited from another shape", () => {
  render(<ShapeGenerator />);
  fireEvent.change(screen.getByRole("combobox", { name: "Shape type" }), { target: { value: "rectangle" } });
  fireEvent.change(screen.getByRole("spinbutton", { name: "Height" }), { target: { value: "33" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Shape type" }), { target: { value: "polygon" } });
  expect(screen.queryByRole("spinbutton", { name: "Height" })).not.toBeInTheDocument();
  expect(screen.getByText("21 × 33")).toBeInTheDocument();
});

it("reproduces translation loss after swapping and reopening a long glyph value", () => {
  const first = render(<EnchantingTableTranslator initialInput={"p".repeat(3000)} initialDirection="english-to-glyphs" />);
  fireEvent.click(screen.getByRole("button", { name: /^Swap$/ }));
  const swapped = (screen.getByRole("textbox", { name: "Enchanting table glyphs" }) as HTMLTextAreaElement).value;
  expect(swapped).toHaveLength(6000);
  expect(screen.getByRole("textbox", { name: "Translation output" })).toHaveValue("p".repeat(3000));
  first.unmount();
  render(<EnchantingTableTranslator initialInput={swapped} initialDirection="glyphs-to-english" />);
  expect(screen.getByRole("textbox", { name: "Translation output" })).toHaveValue("p".repeat(2000));
});

it("reproduces a stale share URL when copied before the 120ms URL sync", () => {
  vi.useFakeTimers();
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
  render(<GeometryGenerator shape="circle" initialOptions={parseGeometryUrl("circle", "diameter=21")} />);
  act(() => vi.advanceTimersByTime(120));
  fireEvent.change(screen.getByRole("spinbutton", { name: "Diameter" }), { target: { value: "31" } });
  fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
  expect(parseGeometryUrl("circle", new URL(copy.mock.calls[0][0]).search).diameter).toBe(21);
  act(() => vi.advanceTimersByTime(120));
  expect(new URL(window.location.href).searchParams.get("diameter")).toBe("31");
});
