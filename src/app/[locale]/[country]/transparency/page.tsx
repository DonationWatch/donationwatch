import { notFound, redirect } from "next/navigation";

import { isValidCountry, isValidLocale } from "@/utils/validate";

export default async function TransparencyRedirectPage(
  props: PageProps<"/[locale]/[country]/transparency">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale) || !isValidCountry(params.country)) {
    return notFound();
  }

  redirect(`/${params.locale}/${params.country}/methodology`);
}
