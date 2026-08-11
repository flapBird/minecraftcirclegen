import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CircleShareButton } from "../../components/circle-generator/circle-share-button";

describe("CircleShareButton", () => {
  it("copies the current share link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const onStatus = vi.fn();
    render(
      <CircleShareButton
        options={{ diameter: 31, mode: "thick", thickness: 3 }}
        onStatus={onStatus}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "⧉ Copy Link" }));
    expect(writeText).toHaveBeenCalledWith(
      "http://localhost:3000/?diameter=31&mode=thick&thickness=3",
    );
    expect(onStatus).toHaveBeenCalledWith("Link copied");
  });
});
