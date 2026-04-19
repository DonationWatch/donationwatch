import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { buildWellKnownAi } from "./util/ai";
import { buildCatalogJson } from "./util/catalog";
import { buildGlobalSitemap } from "./util/global-sitemap";
import { buildLLMsTxt } from "./util/llms";
import { buildOpenapiDocument } from "./util/openapi";

const publicDir = path.join(__dirname, "../../public");
const wellKnownDir = path.join(publicDir, ".well-known");
const schemaDir = path.join(publicDir, "schema");

const llmsTxtFile = path.join(__dirname, "../../public/llms.txt");
const schemaFile = path.join(schemaDir, "openapi.json");
const catalogFile = path.join(wellKnownDir, "api-catalog.json");
const aiFile = path.join(wellKnownDir, "ai");
const globalSitemapFile = path.join(publicDir, "sitemap-global.xml");

const writeOpenApiDocument = async () => {
  const schema = buildOpenapiDocument();
  await fs.writeFile(schemaFile, JSON.stringify(schema, null, 2));
};

const writeLLMsTxt = async () => {
  const llmsTxt = buildLLMsTxt();
  await fs.writeFile(llmsTxtFile, llmsTxt);
};

const writeCatalogJson = async () => {
  const catalogJson = buildCatalogJson();
  await fs.writeFile(catalogFile, JSON.stringify(catalogJson));
};

const writeWellKnownAi = async () => {
  const wellKnownAi = buildWellKnownAi();
  await fs.writeFile(aiFile, JSON.stringify(wellKnownAi));
};

const writeGlobalSitemap = async () => {
  const lastMod = new Date().toISOString().substring(0, "2020-01-01".length);
  const globalSitemap = buildGlobalSitemap(lastMod);
  await fs.writeFile(globalSitemapFile, globalSitemap);
};

const main = async () => {
  await fs.mkdir(wellKnownDir, { recursive: true });
  await fs.mkdir(schemaDir, { recursive: true });

  await Promise.all([
    writeOpenApiDocument(),
    writeLLMsTxt(),
    writeCatalogJson(),
    writeWellKnownAi(),
    writeGlobalSitemap(),
  ]);
};

main();
