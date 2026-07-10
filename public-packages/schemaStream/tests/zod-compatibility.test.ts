import { SchemaStream, type SchemaStreamChunk } from "@/index"
import { describe, expect, test } from "bun:test"
import * as z4 from "zod"
import * as zm from "zod/mini"
import * as z3 from "zod3"

import { collectEmissions } from "./helpers"

describe("schema-derived stubs", () => {
  test("supports Zod 4 defaults, wrappers, nested objects, and falsy explicit values", () => {
    const schema = z4.object({
      title: z4.string(),
      count: z4.number(),
      active: z4.boolean(),
      state: z4.enum(["pending", "ready"]),
      nested: z4
        .object({
          label: z4.string(),
          enabled: z4.boolean()
        })
        .optional(),
      tags: z4.array(z4.string()),
      properties: z4.record(z4.string(), z4.number()),
      defaulted: z4.string().default("from-default"),
      prefaulted: z4.string().prefault("from-prefault"),
      transformed: z4.string().transform(value => value.length)
    })
    const parser = new SchemaStream(schema, {
      defaultData: {
        title: "",
        count: 0,
        active: false,
        nested: { enabled: false }
      },
      typeDefaults: { string: "loading", number: -1, boolean: true }
    })
    const stub: SchemaStreamChunk<typeof schema> = parser.getSchemaStub(schema, {
      title: "",
      count: 0,
      active: false,
      nested: { enabled: false }
    })

    expect(stub).toEqual({
      title: "",
      count: 0,
      active: false,
      state: null,
      nested: { label: "loading", enabled: false },
      tags: [],
      properties: {},
      defaulted: "from-default",
      prefaulted: "from-prefault",
      transformed: "loading"
    })
  })

  test("retains Zod 3.25 compatibility with an independent runtime", () => {
    const schema = z3.object({
      title: z3.string(),
      count: z3.number(),
      active: z3.boolean(),
      state: z3.enum(["pending", "ready"]),
      nested: z3
        .object({
          label: z3.string(),
          enabled: z3.boolean()
        })
        .optional(),
      tags: z3.array(z3.string()),
      properties: z3.record(z3.number()),
      defaulted: z3.string().default("from-default"),
      transformed: z3.string().transform(value => value.length)
    })
    const parser = new SchemaStream(schema, {
      typeDefaults: { string: "loading", number: -1, boolean: true }
    })

    expect(parser.getSchemaStub(schema)).toEqual({
      title: "loading",
      count: -1,
      active: true,
      state: null,
      nested: { label: "loading", enabled: true },
      tags: [],
      properties: {},
      defaulted: "from-default",
      transformed: "loading"
    })
  })

  test("supports Zod Mini through the Zod 4 Core contract", () => {
    const schema = zm.object({
      title: zm.string(),
      nested: zm.optional(zm.object({ count: zm.number() })),
      items: zm.array(zm.boolean())
    })
    const parser = new SchemaStream(schema, {
      typeDefaults: { string: "loading", number: 0, boolean: false }
    })

    expect(parser.getSchemaStub(schema)).toEqual({
      title: "loading",
      nested: { count: 0 },
      items: []
    })
  })

  test("terminates recursive schema stubs safely", () => {
    type Category = { name: string; children?: Category[] }
    const category: z4.ZodType<Category> = z4.object({
      name: z4.string(),
      children: z4.lazy(() => z4.array(category)).optional()
    })
    const schema = z4.object({ category })

    expect(new SchemaStream(schema).getSchemaStub(schema)).toEqual({
      category: { name: null, children: [] }
    })
  })
})

const expectedData = {
  title: "Hello",
  details: { count: 37, enabled: true },
  items: [{ label: "first" }, { label: "second" }]
}
const chunks = Array.from(JSON.stringify(expectedData))

describe("supported Zod major streaming matrix", () => {
  test("Zod 4 emits meaningful intermediates, final output, and completion paths", async () => {
    const schema = z4.object({
      title: z4.string(),
      details: z4.object({ count: z4.number(), enabled: z4.boolean() }),
      items: z4.array(z4.object({ label: z4.string() }))
    })
    const { emissions, completions } = await collectEmissions({ schema, chunks })

    expect(emissions.some(value => value.title === "Hel")).toBe(true)
    expect(
      emissions.some(
        value =>
          value.title === "Hello" && value.details?.count === null && value.items?.length === 0
      )
    ).toBe(true)
    expect(emissions.some(value => value.items?.[0]?.label === "fir")).toBe(true)
    expect(emissions.at(-1)).toEqual(expectedData)
    expect(completions.at(-1)?.activePath).toEqual([])
    expect(completions.at(-1)?.completedPaths).toEqual(
      expect.arrayContaining([
        ["title"],
        ["details", "count"],
        ["details", "enabled"],
        ["items", 0, "label"],
        ["items", 1, "label"]
      ])
    )
  })

  test("Zod 3 emits the same progressive behavior", async () => {
    const schema = z3.object({
      title: z3.string(),
      details: z3.object({ count: z3.number(), enabled: z3.boolean() }),
      items: z3.array(z3.object({ label: z3.string() }))
    })
    const { emissions, completions } = await collectEmissions({ schema, chunks })

    expect(emissions.some(value => value.title === "Hel")).toBe(true)
    expect(emissions.some(value => value.items?.[1]?.label === "sec")).toBe(true)
    expect(emissions.at(-1)).toEqual(expectedData)
    expect(completions.at(-1)?.activePath).toEqual([])
    expect(completions.at(-1)?.completedPaths).toContainEqual(["items", 1, "label"])
  })
})
