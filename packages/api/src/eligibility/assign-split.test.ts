import { describe, expect, it } from "vitest";

import type { SplitThresholds } from "../schemas/league";
import { assignSplit } from "./assign-split";

const thresholds: SplitThresholds = { splitA: 4, splitB: 2.5, splitC: 0 };

describe("assignSplit", () => {
  it("assigns split-a at or above the top threshold", () => {
    expect(assignSplit(4, thresholds)).toBe("split-a");
    expect(assignSplit(4.99, thresholds)).toBe("split-a");
  });

  it("assigns split-b between the split-a and split-b thresholds", () => {
    expect(assignSplit(2.5, thresholds)).toBe("split-b");
    expect(assignSplit(3.99, thresholds)).toBe("split-b");
  });

  it("assigns split-c below the split-b threshold", () => {
    expect(assignSplit(0, thresholds)).toBe("split-c");
    expect(assignSplit(2.49, thresholds)).toBe("split-c");
  });
});
