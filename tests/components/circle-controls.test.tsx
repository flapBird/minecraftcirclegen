import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CircleControls } from "../../components/circle-generator/circle-controls";

function renderControls(mode: "hollow" | "thick" | "filled" = "hollow") {
  const handlers = {
    onDiameterInput: vi.fn(),
    onDiameterCommit: vi.fn(),
    onDiameterChange: vi.fn(),
    onModeChange: vi.fn(),
    onThicknessChange: vi.fn(),
  };
  render(
    <CircleControls
      diameter={21}
      diameterInput="21"
      diameterError=""
      mode={mode}
      thickness={2}
      isEffectivelyFilled={false}
      {...handlers}
    />,
  );
  return handlers;
}

describe("CircleControls", () => {
  it("accepts diameter input and increment controls", async () => {
    const user = userEvent.setup();
    const handlers = renderControls();
    const input = screen.getByLabelText("Diameter");
    await user.clear(input);
    await user.type(input, "31");
    expect(handlers.onDiameterInput).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Increase diameter" }));
    expect(handlers.onDiameterChange).toHaveBeenCalledWith(22);
  });

  it("switches mode and only shows thickness for thick mode", async () => {
    const user = userEvent.setup();
    const handlers = renderControls();
    expect(screen.queryByTestId("thickness-control")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("mode-thick"));
    expect(handlers.onModeChange).toHaveBeenCalledWith("thick");
  });

  it("shows the thickness control in thick mode", () => {
    renderControls("thick");
    expect(screen.getByTestId("thickness-control")).toBeInTheDocument();
  });
});
