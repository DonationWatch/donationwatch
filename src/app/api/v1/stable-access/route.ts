import { BASE_URL, CONTACT_MAIL } from "@/utils/config";

// Just return some information about how to get in contact if one really needs stable access
export async function GET() {
  return Response.json({
    status: "contact_required",
    message:
      "This API is currently experimental. Stable, production-grade access for KYC, banking, or commercial use requires a formal agreement.",
    contact: {
      email: CONTACT_MAIL,
      subject_line: "Stable API Access Request",
      required_info: [
        "Organization Name",
        "Use Case (e.g., KYC, Research, Commercial)",
        "Estimated Request Volume",
      ],
    },
    links: {
      about_page: `${BASE_URL}/en/about`,
    },
  });
}
