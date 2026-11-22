import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(__dirname, "../../..");
export const WEB_DIR = path.join(REPO_ROOT, "apps/web");
export const WEB_PUBLIC_DIR = path.join(WEB_DIR, "public");
export const WEB_MESSAGES_DIR = path.join(WEB_DIR, "src/messages");
export const DATA_COUNTRIES_DIR = path.join(
  REPO_ROOT,
  "packages/data/src/countries",
);
