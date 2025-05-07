import { describe, expect, it } from "vitest";
import { createFixture, flat } from "./create-fixture";

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
      { id: "TENANT_ID", name: "Tenant" },
      { id: "SITE_ID", name: "site", tenantId: "TENANT_ID" },
      { id: "USER_ID", name: "John", siteId: "SITE_ID" },
    ];

    expect(flat(fixture)).toEqual(expected);
  });
});
