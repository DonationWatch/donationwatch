import { redirect } from "next/navigation";

export default async function OriginPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/origin">,
) {
  const params = await props.params;

  redirect(
    `/${params.locale}/${params.country}/party/${params.partyId}/origin/overview`,
  );
}
