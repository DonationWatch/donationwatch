import path from "path";
import { fileURLToPath } from "url";

import { Resvg } from "@resvg/resvg-js";

import type {
  createTranslator,
  Messages,
  NamespaceKeys,
  NestedKeyOf,
} from "next-intl";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const THUMBNAIL_SIZE = {
  width: 800,
  height: 418,
};

export function toImage(svg: string) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: THUMBNAIL_SIZE.width,
    },
    font: {
      // As system fallback font
      fontFiles: [
        path.join(__dirname, "./fonts/NotoSans-Regular.ttf"),
        path.join(__dirname, "./fonts/NotoSans-Medium.ttf"),
        path.join(__dirname, "./fonts/NotoSans-SemiBold.ttf"),
        path.join(__dirname, "./fonts/NotoSans-Bold.ttf"),
        path.join(__dirname, "./fonts/NotoSansGeorgian-SemiBold.ttf"),
        path.join(__dirname, "./fonts/NotoSansMath-Regular.ttf"),
      ],
      loadSystemFonts: false,
      defaultFontFamily: "NotoSans",
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

export type CreateTranslator = <
  NestedKey extends NamespaceKeys<Messages, NestedKeyOf<Messages>> = never,
>(
  namespace?: NestedKey,
) => ReturnType<typeof createTranslator<Messages, NestedKey>>;
