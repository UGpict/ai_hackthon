import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSerpRaid } from "./serp-raid.ts";

describe("buildSerpRaid", () => {
  it("builds a Pain SERP with three generic rivals to steal from", () => {
    const plan = buildSerpRaid("副業がバレた");
    assert.equal(plan.query, "副業がバレた");
    assert.equal(plan.rivals.length, 3);
    assert.match(plan.yourTitle, /副業がバレた/);
    assert.ok(plan.rivals.every((r) => r.title.includes("副業がバレた")));
  });
});
