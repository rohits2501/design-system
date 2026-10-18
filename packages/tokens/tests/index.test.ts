import { expect, test } from "vite-plus/test";
import { tokens } from "../src/index.ts";

test("tokens placeholder", () => {
  expect(tokens.theme).toBe("placeholder");
});
