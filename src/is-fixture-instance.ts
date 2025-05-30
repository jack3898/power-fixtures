import type { FixtureInstance, AnyObject } from "./types";

export function isBasicFixture(
  maybeFixture: unknown
): maybeFixture is FixtureInstance<AnyObject> {
  return (
    typeof maybeFixture === "object" &&
    maybeFixture !== null &&
    "$meta" in maybeFixture
  );
}
