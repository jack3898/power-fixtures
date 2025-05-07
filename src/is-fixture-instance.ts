import type { FixtureInstance, MaybeFixture } from "./types";

export function isFixtureInstance(
  maybeFixture: unknown
): maybeFixture is FixtureInstance<MaybeFixture> {
  return (
    typeof maybeFixture === "object" &&
    maybeFixture !== null &&
    "$meta" in maybeFixture
  );
}
