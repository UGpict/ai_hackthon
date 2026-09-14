import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractPainFromWorkLog,
  refuseReasonLabel,
  SAMPLE_WORK_LOG,
} from "./pain-extract.ts";

describe("extractPainFromWorkLog", () => {
  it("keeps lines with pain signals from sample work log", () => {
    const result = extractPainFromWorkLog(SAMPLE_WORK_LOG);
    assert.equal(result.method, "local-heuristics-v1");
    assert.ok(result.kept.length >= 3);
    assert.ok(
      result.kept.some((k) => k.phrase.includes("後悔")),
      "expected a regret phrase",
    );
  });

  it("refuses comparison shopping language", () => {
    const result = extractPainFromWorkLog(
      "おすすめランキングを見たい\n転職して後悔した夜に検索した",
    );
    assert.ok(
      result.refused.some((r) => r.reason === "comparison_shopping"),
      "comparison should be refused",
    );
    assert.ok(result.kept.some((k) => k.phrase.includes("後悔")));
  });

  it("refuses lines without pain signals", () => {
    const result = extractPainFromWorkLog(
      "本日は晴天なり。会議は予定通り終了。",
    );
    assert.equal(result.kept.length, 0);
    assert.ok(result.refused.every((r) => r.reason === "no_pain_signal"));
  });

  it("exposes human-readable refuse reasons", () => {
    assert.match(refuseReasonLabel("too_generic"), /汎用/);
  });
});
