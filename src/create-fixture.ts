type FixtureConfig<T> = {
  key: string;
  defaultValues?: Partial<T>;
};

type FixtureFn<T> = (
  overrides?: Partial<T & Record<string, any>>
) => FixtureInstance<T>;

type FixtureInstance<T> = T & {
  __meta: FixtureConfig<T>;
};

export function createFixture<T>(config: FixtureConfig<T>): FixtureFn<T> {
  return function (overrides = {}) {
    return {
      ...config.defaultValues,
      ...overrides,
      __meta: config,
    } as FixtureInstance<T>;
  };
}

export function flat(root: any): any[] {
  const result: any[] = [];

  function traverse(node: any) {
    if (typeof node !== "object" || node === null || !node.__meta) {
      return;
    }

    const { __meta, ...noMeta } = node;

    // Process nested fixtures first
    for (const key of Object.keys(noMeta)) {
      const value = noMeta[key];

      if (typeof value === "object" && value !== null && value.__meta) {
        traverse(value);
        // Replace the nested fixture object with its key value
        noMeta[key] = value[value.__meta.key];
      }
    }

    result.push(noMeta);
  }

  traverse(root);

  return result;
}
