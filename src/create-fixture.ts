type MaybeFixture = Record<PropertyKey, unknown>;

type FixtureConfig<T> = {
  key: string;
  defaultValues: T;
};

type FixtureFn<T extends MaybeFixture> = {
  (overrides?: Partial<T>): FixtureInstance<T>;
  isInstance: (obj: MaybeFixture) => obj is FixtureInstance<T>;
  clean: (obj: FixtureInstance<T>) => Omit<FixtureInstance<T>, "$meta">;
};

type FixtureInstance<T extends MaybeFixture> = T & {
  $meta: FixtureConfig<T>;
};

export function createFixture<T extends MaybeFixture>(
  config: FixtureConfig<T>,
): FixtureFn<T> {
  function fn(overrides?: Partial<T>): FixtureInstance<T> {
    return {
      ...config.defaultValues,
      ...(overrides ?? {}),
      $meta: config,
    };
  }

  fn.isInstance = (obj: unknown): obj is FixtureInstance<T> => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "$meta" in obj &&
      obj.$meta === config
    );
  };

  fn.clean = (obj: FixtureInstance<T>): Omit<FixtureInstance<T>, "$meta"> => {
    const { $meta, ...rest } = obj;

    return rest;
  };

  return fn;
}

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

function isFixtureInstance(
  maybeFixture: unknown,
): maybeFixture is FixtureInstance<MaybeFixture> {
  return (
    typeof maybeFixture === "object" &&
    maybeFixture !== null &&
    "$meta" in maybeFixture
  );
}
