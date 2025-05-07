export type AnyObject = Record<PropertyKey, unknown>;

export type FixtureConfig<T> = {
  key: keyof T;
  defaultValues: T;
};

export type FixtureFn<T extends AnyObject> = {
  (overrides?: Partial<T>): FixtureInstance<T>;
  isInstance: (obj: AnyObject) => obj is FixtureInstance<T>;
  clean: (obj: FixtureInstance<T>) => Omit<FixtureInstance<T>, "$meta">;
};

export type FixtureInstance<T extends AnyObject> = T & {
  $meta: FixtureConfig<T>;
};
