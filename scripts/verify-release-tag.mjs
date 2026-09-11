import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const tag = process.env.GITHUB_REF_NAME ?? process.argv[2];
const expectedTag = `v${packageJson.version}`;

if (!tag) {
  throw new Error("Pass a tag as the first argument or set GITHUB_REF_NAME.");
}

if (tag !== expectedTag) {
  throw new Error(`Release tag ${tag} does not match package version ${expectedTag}.`);
}

console.log(`Release tag ${tag} matches package version.`);
