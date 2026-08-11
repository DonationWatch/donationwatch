import * as lucideIcons from "lucide-react";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// List of Lucide icons used across sidebar/layout sprite icons
const LUCIDE_ICONS_TO_EXTRACT = [
  "CalendarDays",
  "ChartBarStacked",
  "ChevronDown",
  "ChevronRight",
  "FileSpreadsheet",
  "Globe",
  "Info",
  "Scale",
  "Server",
  "Sparkles",
  "Vote",
] as const;

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function generateLucideSymbol(iconName: string): string {
  const kebabName = camelToKebab(iconName);
  const IconComponent = (
    lucideIcons as unknown as Record<string, React.ComponentType>
  )[iconName];
  if (!IconComponent) {
    throw new Error(`Icon ${iconName} not found in lucide-react`);
  }

  const svgString = renderToStaticMarkup(React.createElement(IconComponent));
  // Extract inner SVG content (inside <svg ...>...</svg>)
  const innerMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!innerMatch) {
    throw new Error(`Failed to parse SVG content for ${iconName}`);
  }
  const innerContent = innerMatch[1];

  return `  <symbol id="lucide-${kebabName}" viewBox="0 0 24 24">\n    ${innerContent}\n  </symbol>`;
}

async function main() {
  const publicDir = path.resolve(process.cwd(), "public");
  const spritePath = path.join(publicDir, "icons.svg");

  const customSymbols = [
    `  <symbol id="github" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.7 4.7 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3"
    />
  </symbol>`,

    `  <symbol id="bluesky" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 10.8c-1-2.1-4-6-6.8-8C2.6 1 1.6 1.3.9 1.6.1 1.9 0 3 0 3.8c0 .7.4 5.6.6 6.4C1.4 13 4.3 14 7 13.6c-4 .6-7.4 2-2.8 7 5 5.3 6.8-1 7.8-4.2 1 3.2 2 9.3 7.7 4.3 4.3-4.3 1.2-6.5-2.7-7a8.7 8.7 0 0 1-.4-.1h.4c2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.7.6-6.4 0-.7-.1-1.9-.9-2.2-.7-.3-1.7-.7-4.3 1.2-2.8 2-5.7 5.9-6.8 8Z"
    />
  </symbol>`,

    `  <symbol id="twitter" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M18.9 1.15h3.68l-8.04 9.2L24 22.84h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.6l5.24 6.94Zm-1.29 19.5h2.04L6.49 3.23h-2.2Z"
    />
  </symbol>`,
  ];

  const lucideSymbols = LUCIDE_ICONS_TO_EXTRACT.map(generateLucideSymbol);

  const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\n${customSymbols.join(
    "\n\n",
  )}\n\n${lucideSymbols.join("\n\n")}\n</svg>\n`;

  await fs.promises.writeFile(spritePath, spriteContent, "utf-8");
  console.log(
    `Generated icon sprite at ${spritePath} with ${LUCIDE_ICONS_TO_EXTRACT.length} lucide icons and 3 custom icons.`,
  );
}

main().catch((err) => {
  console.error("Error generating icon sprite:", err);
  process.exit(1);
});
