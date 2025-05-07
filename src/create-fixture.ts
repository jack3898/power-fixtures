type Obj = Record<PropertyKey, unknown>;

type FixtureConfig<T> = {
  key: string;
  defaultValues: T;
};

type FixtureFn<T extends Obj> = (overrides?: Partial<T>) => FixtureInstance<T>;

type FixtureInstance<T extends Obj> = T & {
  __meta: FixtureConfig<T>;
};

export function createFixture<T extends Obj>(
  config: FixtureConfig<T>,
): FixtureFn<T> {
  return (overrides): FixtureInstance<T> => ({
    ...config.defaultValues,
    ...overrides,
    __meta: config,
  });
}

export function flat<T extends Obj>(root: FixtureInstance<T>): unknown[] {
  const result: Obj[] = [];

  function traverse(node: FixtureInstance<Obj>) {
    if (typeof node !== "object") {
      return;
    }

    const { __meta, ...rest } = node;

    for (const key of Object.keys(node)) {
      const value = rest[key];

      if (isFixtureInstance(value)) {
        traverse(value);
        // Replace the nested fixture object with its key value
        rest[key] = value[value.__meta.key];
      }
    }

    result.push(rest);
  }

  traverse(root);

  return result;
}

function isFixtureInstance(
  maybeFixture: unknown,
): maybeFixture is FixtureInstance<Obj> {
  return (
    typeof maybeFixture === "object" &&
    maybeFixture !== null &&
    "__meta" in maybeFixture
  );
}
