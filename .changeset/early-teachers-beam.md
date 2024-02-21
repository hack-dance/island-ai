---
"schema-stream": major
---

Updating the defaults to all be null except for objects and arrays - also not explicitly looking for .default values

Previously we had "", 0, and false default values for primitives (silly) - you could still pass nulls as defaults through the explicit defaultValues map - but this is now the default and they can be updated either via zod .default or using the defaultValues map if there is a need for a more explicit default.
