// Browser-only no-op stub for Node's `buffer` module.
// zrender/lib/svg/helper.js guards `encodeBase64` with
// `typeof Buffer !== "undefined" && typeof Buffer.from === "function"`
// and falls back to browser `btoa(...)`.
export const Buffer = undefined;
