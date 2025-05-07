import { isFixtureInstance } from "./is-fixture-instance";
import type { FixtureInstance, AnyObject } from "./types";

export function flat<T extends AnyObject>(
  root: FixtureInstance<T>
): AnyObject[] {
  const result: AnyObject[] = [];

  function traverse(node: AnyObject) {
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
