import { redirect } from "next/navigation";

export default async function OriginPage(
  props: PageProps<"/[locale]/[country]/[years]/origin">,
) {
  const params = await props.params;

  redirect(
    `/${params.locale}/${params.country}/${params.years}/origin/overview`,
  );
}
