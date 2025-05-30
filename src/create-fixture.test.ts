import { describe, expect, it } from "vitest";
import { createFixture } from "./create-fixture";
import { flat } from "./flat";

describe("api", () => {
  const tenantFixture = createFixture({
    key: "id",
    defaultValues: { id: "TENANT_ID", name: "Tenant" },
  });

  const siteFixture = createFixture({
    key: "id",
    defaultValues: { id: "SITE_ID", name: "Site", tenantId: tenantFixture() },
  });

  const userFixture = createFixture({
    key: "id",
    defaultValues: { id: "USER_ID", name: "John Doe", siteId: siteFixture() },
  });

  it("flattens nested fixture dynamically", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture({
        name: "site",
        tenantId: tenantFixture(),
      }),
    });

    const expected = [
      expect.objectContaining({ id: "TENANT_ID", name: "Tenant" }),
      expect.objectContaining({
        id: "SITE_ID",
        name: "site",
        tenantId: "TENANT_ID",
      }),
      expect.objectContaining({
        id: "USER_ID",
        name: "John",
        siteId: "SITE_ID",
      }),
    ];

    expect(flat(fixture)).toEqual(expected);
  });

  it("flattens nested fixture dynamically with array input", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture({
        name: "site",
        tenantId: tenantFixture(),
      }),
    });

    const expected = [
      expect.objectContaining({ id: "TENANT_ID", name: "Tenant" }),
      expect.objectContaining({
        id: "SITE_ID",
        name: "site",
        tenantId: "TENANT_ID",
      }),
      expect.objectContaining({
        id: "USER_ID",
        name: "John",
        siteId: "SITE_ID",
      }),
    ];

    expect(flat([fixture])).toEqual(expected);
  });

  it("should use isThis utility to detect if it is the correct fixture", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture({
        name: "site",
        tenantId: tenantFixture(),
      }),
    });

    const flattened = flat(fixture);
    expect(tenantFixture.isInstance(flattened[0])).toBe(true);
  });

  it("should allow one to clean the output", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture({
        name: "site",
        tenantId: tenantFixture(),
      }),
    });

    const flattened = flat(fixture);

    expect(
      tenantFixture.isInstance(flattened[0]) &&
        tenantFixture.clean(flattened[0])
    ).toEqual({ id: "TENANT_ID", name: "Tenant" });
  });

  it("should deduplicate fixtures", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture(),
    });
    const fixture2 = userFixture({
      name: "Doe",
      siteId: siteFixture(),
    });

    const flattened = flat([fixture, fixture2]);
    const filtered = flattened.filter((item) => {
      return siteFixture.isInstance(item);
    });

    expect(flattened).toHaveLength(4); // 1 for tenant, 1, for site, 2 for users
    expect(filtered).toHaveLength(1);
  });
});
