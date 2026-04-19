import { CONTACT_MAIL, DATA_LICENSE, OPENAPI_URL } from "@/utils/config";

export const buildWellKnownAi = () => {
  return {
    api_spec: OPENAPI_URL,
    name: "DonationWatch",
    description:
      "Comprehensive political donation data for multiple countries.",
    contact_email: CONTACT_MAIL,
    capabilities: ["data_retrieval", "political_analysis"],
    usage_guidelines: `Licensed under ${DATA_LICENSE}. Please cite donation.watch as the source.`,
  };
};
