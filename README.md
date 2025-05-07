# Create fixtures

This project is a WIP and a much prettier README is to come!

What is this project aiming to do?

The end goal is to provide utilities that allow you to generate fixtures to keep testing DRY. This is mainly geared towards database integration testing, when sometimes creating test data for many inter-related object structures is difficult.

This package will provide a `flat()` utility to flatten a fixture. When flattened, it becomes really useful for integration testing, e.g. seeding a DB.

Using the structure of the nested object, the children will always be nearer the top of the array, and the more root-level objects nearer the bottom. This makes a procedural seed of data in a DB much easier.

The flattened object will also substitute all foreign keys for the primary key of the child (which in a related db will actually be the parent!)

## Example of the API

(all subject to change)

```ts
const site = createFixture({
  key: "id",
  defaultValues: { id: "SITE_ID", name: "Site" },
});

const user = createFixture({
  key: "id",
  defaultValues: { id: "USER_ID", name: "John Doe" },
});

const tenant = createFixture({
  key: "id",
  defaultValues: { id: "TENANT_ID", name: "Tenant" },
});
```

Then you can create your desired structure for something like an integration test:

```ts
const fixture = user({
  name: "John",
  siteId: site({
    name: "site",
    tenantId: tenant(),
  }),
  secondSiteId: site({
    id: "SITE_ID2",
    name: "site2",
  }),
});
```

And when you're ready, you can call `flat()` on it:

```ts
const flattened = flat(fixture);
```

Then this is what `flattened` will become:

```ts
[
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
```

Then using your database technology of choice, you can write a utility for your test suites to convert that into procedural database calls to set up your test bed!
