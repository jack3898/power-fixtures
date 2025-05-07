import { isBasicFixture } from "./is-fixture-instance";
import type { FixtureInstance, AnyObject, FixtureConfig } from "./types";

export function flat<T extends AnyObject>(
  root: FixtureInstance<T> | FixtureInstance<T>[]
): AnyObject[] {
  const result: AnyObject[] = [];
  const visited = new Set<FixtureConfig<AnyObject>>();

  function traverse(node: AnyObject) {
    if (isBasicFixture(node) && visited.has(node.$meta)) {
      return;
    }

    for (const key of Object.keys(node)) {
      const value = node[key];

      if (isBasicFixture(value)) {
        traverse(value);
        // Replace the nested fixture object with its key value
        node[key] = value[value.$meta.key];
        visited.add(value.$meta);
      }
    }

    result.push(node);
  }

  if (Array.isArray(root)) {
    for (const item of root) {
      traverse(item);
    }
  } else {
    traverse(root);
  }

  return result;
}
