import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FontGenerator } from "@/components/font-generator/font-generator";
import { BannerMaker } from "@/components/banner-maker/banner-maker";
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

it("keeps oversized font text editable and recovers after reducing scale", () => {
  render(<FontGenerator />);
  const input = screen.getByRole("textbox", { name: "Your text" });
  fireEvent.change(input, { target: { value: "A".repeat(200) } });
  expect(screen.getByRole("alert")).toHaveTextContent("8,192");
  expect(input).toHaveValue("A".repeat(200));
  expect(screen.getByRole("button", { name: /Download PNG/ })).toBeDisabled();
  fireEvent.change(screen.getByRole("slider", { name: "Scale" }), { target: { value: "4" } });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Download PNG/ })).toBeEnabled();
  fireEvent.change(input, { target: { value: "A".repeat(4001) } });
  expect(screen.getByRole("alert")).toHaveTextContent("4,000");
  expect(input).toHaveValue("A".repeat(4001));
  expect(screen.getByRole("button", { name: "Copy blueprint" })).toBeDisabled();
});

it("keeps inherited polygon height visible and editable", () => {
  render(<ShapeGenerator />);
  fireEvent.change(screen.getByRole("combobox", { name: "Shape type" }), { target: { value: "rectangle" } });
  fireEvent.change(screen.getByRole("spinbutton", { name: "Height" }), { target: { value: "33" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Shape type" }), { target: { value: "polygon" } });
  expect(screen.getByRole("spinbutton", { name: "Height" })).toHaveValue(33);
  fireEvent.change(screen.getByRole("spinbutton", { name: "Height" }), { target: { value: "27" } });
  expect(screen.getByText("21 × 27")).toBeInTheDocument();
});

it("preserves all glyphs after swapping and reopening a long translation", () => {
  const first = render(<EnchantingTableTranslator initialInput={"p".repeat(3000)} initialDirection="english-to-glyphs" />);
  fireEvent.click(screen.getByRole("button", { name: /^Swap$/ }));
  const swapped = (screen.getByRole("textbox", { name: "Enchanting table glyphs" }) as HTMLTextAreaElement).value;
  expect(swapped).toHaveLength(6000);
  expect(screen.getByRole("textbox", { name: "Translation output" })).toHaveValue("p".repeat(3000));
  first.unmount();
  render(<EnchantingTableTranslator initialInput={swapped} initialDirection="glyphs-to-english" />);
  expect(screen.getByRole("textbox", { name: "Translation output" })).toHaveValue("p".repeat(3000));
});

it("copies current dimensions before the debounced URL sync", () => {
  vi.useFakeTimers();
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
  render(<GeometryGenerator shape="circle" initialOptions={parseGeometryUrl("circle", "diameter=21")} />);
  act(() => vi.advanceTimersByTime(120));
  fireEvent.change(screen.getByRole("spinbutton", { name: "Diameter" }), { target: { value: "31" } });
  fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
  expect(parseGeometryUrl("circle", new URL(copy.mock.calls[0][0]).search).diameter).toBe(31);
  act(() => vi.advanceTimersByTime(120));
  expect(new URL(window.location.href).searchParams.get("diameter")).toBe("31");
});

it("shares long glyph content as a fragment and restores it without truncation", async () => {
  vi.useFakeTimers();
  const copy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: copy } });
  const first = render(<EnchantingTableTranslator initialInput={"p".repeat(3000)} initialDirection="english-to-glyphs" />);
  fireEvent.click(screen.getByRole("button", { name: /^Swap$/ }));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy Share Link" })));
  const url = new URL(copy.mock.calls[0][0]);
  expect(url.searchParams.has("text")).toBe(false);
  expect(new URLSearchParams(url.hash.slice(1)).get("text")).toHaveLength(6000);
  first.unmount();
  render(<EnchantingTableTranslator />);
  act(() => vi.advanceTimersByTime(0));
  expect(screen.getByRole("textbox", { name: "Translation output" })).toHaveValue("p".repeat(3000));
});

it("keeps over-capacity translator input intact and prevents unusable exports", () => {
  const input = "p".repeat(8001);
  render(<EnchantingTableTranslator initialInput={input} initialDirection="english-to-glyphs" />);
  expect(screen.getByRole("textbox", { name: "English text" })).toHaveValue(input);
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copy Share Link" })).toBeDisabled();
  expect(screen.getByRole("button", { name: /^Swap$/ })).toBeDisabled();
});

it("keeps the banner editor usable when storage is blocked and reports save failure", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("full"); });
  render(<BannerMaker />);
  fireEvent.click(screen.getByRole("button", { name: "Add Circle layer" }));
  fireEvent.click(screen.getByRole("button", { name: "+ Save current" }));
  expect(screen.getByRole("status")).toHaveTextContent("Device storage is unavailable or full");
  expect(screen.queryByRole("button", { name: "Load saved banner 1" })).not.toBeInTheDocument();
  expect(screen.getByText("1 / 6 layers")).toBeInTheDocument();
});
