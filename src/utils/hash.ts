const shaCache: Record<string, string> = {};
export const clientSha1 = async (string: string): Promise<string> => {
  if (shaCache[string]) {
    return shaCache[string];
  }

  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-1", enc.encode(string));
  const hashed = Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

  shaCache[string] = hashed;

  return hashed;
};
