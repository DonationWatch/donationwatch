import {
  DISCOVERY_INDEX_URL,
  LLMS_URL,
  OPENAPI_URL,
  PROD_URL,
} from "@/utils/config";

// RFC 9727 — API Catalog (https://www.rfc-editor.org/rfc/rfc9727)
// RFC 9264 — Linkset (https://www.rfc-editor.org/rfc/rfc9264)
export const buildCatalogJson = () => {
  return {
    linkset: [
      {
        anchor: PROD_URL,
        "service-desc": [
          { href: OPENAPI_URL, type: "application/openapi+json" },
        ],
        "service-doc": [{ href: LLMS_URL }],
        status: [{ href: DISCOVERY_INDEX_URL }],
      },
    ],
  };
};
