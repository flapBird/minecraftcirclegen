import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CircleBuilder } from "../../components/circle-generator/circle-builder";
import { generateCircle } from "../../lib/circle/generate-circle";

const result = generateCircle({
  diameter: 7,
  mode: "hollow",
  thickness: 1,
});

function renderBuilder(currentRow = 1, completedRows = new Set<number>()) {
  const handlers = {
    onStart: vi.fn(),
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onComplete: vi.fn(),
    onReset: vi.fn(),
    onExit: vi.fn(),
  };
  render(
    <CircleBuilder
      result={result}
      active
      currentRow={currentRow}
      completedRows={completedRows}
      storageWarning={false}
      {...handlers}
    />,
  );
  return handlers;
}

describe("CircleBuilder", () => {
  it("moves to previous and next rows", async () => {
    const user = userEvent.setup();
    const handlers = renderBuilder();
    await user.click(screen.getByRole("button", { name: "↑ Previous Row" }));
    await user.click(screen.getByRole("button", { name: "↓ Next Row" }));
    expect(handlers.onPrevious).toHaveBeenCalledOnce();
    expect(handlers.onNext).toHaveBeenCalledOnce();
  });

  it("marks the current row complete", async () => {
    const user = userEvent.setup();
    const handlers = renderBuilder();
    await user.click(screen.getByTestId("mark-complete"));
    expect(handlers.onComplete).toHaveBeenCalledOnce();
  });

  it("requests a reset through its reset control", async () => {
    const user = userEvent.setup();
    const handlers = renderBuilder();
    await user.click(screen.getByRole("button", { name: "Reset Progress" }));
    expect(handlers.onReset).toHaveBeenCalledOnce();
  });
});
