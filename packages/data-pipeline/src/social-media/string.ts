// Takes a string "Foo {bar} baz" and interpolates it with the given variables
export const interpolate = (
  string: string,
  variables: Record<string, string | number>,
): string => {
  return string.replace(/\{([a-zA-Z0-9]+)}/g, (match: string, key: string) => {
    return `${variables[key] ?? match}`;
  });
};
