import type {
  FixtureConfig,
  FixtureFn,
  FixtureInstance,
  MaybeFixture,
} from "./types";

export function createFixture<T extends MaybeFixture, K extends string>(
  config: FixtureConfig<T>
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
