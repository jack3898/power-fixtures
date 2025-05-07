export type MaybeFixture = Record<PropertyKey, unknown>;

export type FixtureConfig<T> = {
  key: keyof T;
  defaultValues: T;
};

export type FixtureFn<T extends MaybeFixture> = {
  (overrides?: Partial<T>): FixtureInstance<T>;
  isInstance: (obj: MaybeFixture) => obj is FixtureInstance<T>;
  clean: (obj: FixtureInstance<T>) => Omit<FixtureInstance<T>, "$meta">;
};

export type FixtureInstance<T extends MaybeFixture> = T & {
  $meta: FixtureConfig<T>;
};
