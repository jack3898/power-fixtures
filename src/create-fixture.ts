type MaybeFixture = Record<PropertyKey, unknown>;

type FixtureConfig<T> = {
  key: string;
  defaultValues: T;
};

type FixtureFn<T extends MaybeFixture> = {
  (overrides?: Partial<T>): FixtureInstance<T>;
  isThis: (obj: unknown) => obj is FixtureInstance<T>;
};

type FixtureInstance<T extends MaybeFixture> = T & {
  $meta: FixtureConfig<T>;
};

export function createFixture<T extends MaybeFixture>(
  config: FixtureConfig<T>,
): FixtureFn<T> {
  function fn(overrides: Partial<T>): FixtureInstance<T> {
    return {
      ...config.defaultValues,
      ...overrides,
      $meta: config,
    };
  }

  fn.isThis = (obj: unknown): obj is FixtureInstance<T> => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "$meta" in obj &&
      obj.$meta === config
    );
  };

  return fn as FixtureFn<T>;
}

export function flat<T extends MaybeFixture>(
  root: FixtureInstance<T>,
): MaybeFixture[] {
  const result: MaybeFixture[] = [];

  function traverse(node: FixtureInstance<MaybeFixture>) {
    if (typeof node !== "object") {
      return;
    }

    const { $meta, ...rest } = node;

    for (const key of Object.keys(node)) {
      const value = rest[key];

      if (isFixtureInstance(value)) {
        traverse(value);
        // Replace the nested fixture object with its key value
        rest[key] = value[value.$meta.key];
      }
    }

    result.push(rest);
  }

  traverse(root);

  return result;
}

function isFixtureInstance(
  maybeFixture: unknown,
): maybeFixture is FixtureInstance<MaybeFixture> {
  return (
    typeof maybeFixture === "object" &&
    maybeFixture !== null &&
    "$meta" in maybeFixture
  );
}
