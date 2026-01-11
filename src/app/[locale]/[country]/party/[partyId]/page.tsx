import { redirect } from "next/navigation";

export default async function PartyPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]">,
) {
  const params = await props.params;
  redirect(
    `/${params.locale}/${params.country}/party/${params.partyId}/donors`,
  );
}
