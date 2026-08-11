import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/circle-generator/circle-canvas", () => ({
  CircleCanvas: ({
    settingsPanel,
    summaryPanel,
    builderPanel,
    actionPanel,
  }: {
    settingsPanel: ReactNode;
    summaryPanel: ReactNode;
    builderPanel: ReactNode;
    actionPanel: ReactNode;
  }) => (
    <div>
      {settingsPanel}
      {summaryPanel}
      {builderPanel}
      {actionPanel}
    </div>
  ),
}));

import { CircleGenerator } from "@/components/circle-generator/circle-generator";

const initialOptions = { diameter: 21, mode: "hollow" as const, thickness: 1 };

describe("CircleGenerator integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => vi.restoreAllMocks());

  it("clamps the builder row when the diameter becomes smaller", async () => {
    const user = userEvent.setup();
    render(<CircleGenerator initialOptions={initialOptions} />);
    await user.click(screen.getByRole("button", { name: "Start Builder Mode" }));
    const next = screen.getByRole("button", { name: "↓ Next Row" });
    for (let index = 0; index < 7; index += 1) await user.click(next);
    expect(screen.getByRole("heading", { name: "Row 8 of 21" })).toBeInTheDocument();

    const diameter = screen.getByLabelText("Diameter");
    await user.clear(diameter);
    await user.type(diameter, "3");

    const restart = await screen.findByRole("button", { name: "Start Builder Mode" });
    expect(screen.getByText("3 × 3 · Hollow")).toBeInTheDocument();
    await user.click(restart);
    expect(screen.getByRole("heading", { name: "Row 1 of 3" })).toBeInTheDocument();
  });

  it("ignores the second click while a completed row is advancing", async () => {
    const user = userEvent.setup();
    render(<CircleGenerator initialOptions={initialOptions} />);
    await user.click(screen.getByRole("button", { name: "Start Builder Mode" }));
    await user.dblClick(screen.getByTestId("mark-complete"));

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Row 2 of 21" })).toBeInTheDocument(),
    );
    expect(screen.getByText("1 of 21 rows complete")).toBeInTheDocument();
  });
});
