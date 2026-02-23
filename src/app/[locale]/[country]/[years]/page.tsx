import { redirect } from "next/navigation";

export default async function YearPage(
  props: PageProps<"/[locale]/[country]/[years]">,
) {
  const params = await props.params;
  redirect(`/${params.locale}/${params.country}/${params.years}/overview`);
}
