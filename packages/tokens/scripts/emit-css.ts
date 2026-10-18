import { writeFileSync } from "node:fs";
import { renderThemeCss } from "../src/css.ts";

const target = new URL("../src/theme.css", import.meta.url);
writeFileSync(target, renderThemeCss());
console.log(`wrote ${target.pathname}`);
