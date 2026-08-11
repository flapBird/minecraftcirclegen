import type { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/circle-generator/circle-canvas", () => ({
  CircleCanvas: ({
    settingsPanel,
    summaryPanel,
    actionPanel,
  }: {
    settingsPanel: ReactNode;
    summaryPanel: ReactNode;
    actionPanel: ReactNode;
  }) => (
    <div>
      {settingsPanel}
      {summaryPanel}
      {actionPanel}
    </div>
  ),
}));

import { CircleGenerator } from "@/components/circle-generator/circle-generator";

const initialOptions = { diameter: 21, mode: "hollow" as const, thickness: 1 };

describe("CircleGenerator integration", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("updates the live blueprint summary when the diameter changes", async () => {
    const user = userEvent.setup();
    render(<CircleGenerator initialOptions={initialOptions} />);
    const diameter = screen.getByLabelText("Diameter");
    await user.clear(diameter);
    await user.type(diameter, "31");
    expect(screen.getByText("31 × 31 · Hollow")).toBeInTheDocument();
    expect(screen.queryByText("Builder Mode")).not.toBeInTheDocument();
  });

  it("preserves unrelated URL parameters when settings change", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/?utm_source=test");
    render(<CircleGenerator initialOptions={initialOptions} />);
    await user.click(screen.getByTestId("mode-filled"));

    await waitFor(() => {
      const params = new URLSearchParams(window.location.search);
      expect(params.get("utm_source")).toBe("test");
      expect(params.get("mode")).toBe("filled");
    });
  });
});
