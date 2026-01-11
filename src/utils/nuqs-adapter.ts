import { type Type, type } from "arktype";
import { createParser } from "nuqs";

export function parseAsBase64ArkType<T>(arkType: Type<T>) {
  return createParser({
    // READ: URL String (Base64) -> Object
    parse: (queryValue) => {
      try {
        if (!queryValue) return null;

        // 1. Decode Base64 to JSON String
        // "eyJhZ2UiOjI1fQ==" -> '{"age":25}'
        const jsonString = atob(queryValue);

        // 2. Parse JSON String to Object
        const json = JSON.parse(jsonString);

        // 3. Validate with ArkType
        const result = arkType(json);

        if (result instanceof type.errors) {
          console.warn("Validation failed:", result.summary);
          return null;
        }

        return result as T;
      } catch {
        // Catches malformed Base64 OR malformed JSON
        return null;
      }
    },

    // WRITE: Object -> URL String (Base64)
    serialize: (value) => {
      try {
        // 1. Stringify Object
        const jsonString = JSON.stringify(value);

        // 2. Encode to Base64
        return btoa(jsonString);
      } catch {
        return "";
      }
    },
  });
}
