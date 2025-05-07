import { describe, expect, it } from "vitest";
import { createFixture, flat } from "./create-fixture";

describe("api", () => {
  const siteFixture = createFixture({
    key: "id",
    defaultValues: { id: "SITE_ID", name: "Site" },
  });

  const userFixture = createFixture({
    key: "id",
    defaultValues: { id: "USER_ID", name: "John Doe" },
  });

  const tenantFixture = createFixture({
    key: "id",
    defaultValues: { id: "TENANT_ID", name: "Tenant" },
  });

  it("flattens nested fixture dynamically", () => {
    const fixture = userFixture({
      name: "John",
      siteId: siteFixture({
        name: "site",
        tenantId: tenantFixture(),
      }),
      secondSiteId: siteFixture({
        id: "SITE_ID2",
        name: "site2",
      }),
    });

    const expected = [
      { id: "TENANT_ID", name: "Tenant" },
      { id: "SITE_ID", name: "site", tenantId: "TENANT_ID" },
      { id: "SITE_ID2", name: "site2" },
      {
        id: "USER_ID",
        name: "John",
        siteId: "SITE_ID",
        secondSiteId: "SITE_ID2",
      },
    ];

    expect(flat(fixture)).toEqual(expected);
  });
});
