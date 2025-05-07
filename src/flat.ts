import { isFixtureInstance } from "./is-fixture-instance";
import type { FixtureInstance, MaybeFixture } from "./types";

export function flat<T extends MaybeFixture>(
  root: FixtureInstance<T>,
): MaybeFixture[] {
  const result: MaybeFixture[] = [];

  function traverse(node: FixtureInstance<MaybeFixture>) {
    if (typeof node !== "object") {
      return;
    }

    for (const key of Object.keys(node)) {
      const value = node[key];

      if (isFixtureInstance(value)) {
        traverse(value);
        // Replace the nested fixture object with its key value
        node[key] = value[value.$meta.key];
      }
    }

    result.push(node);
  }

  traverse(root);

  return result;
}
