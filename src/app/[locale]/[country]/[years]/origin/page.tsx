"use client";
import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

import Loading from "../../../../../components/loading";

export default function OriginPage(
  props: PageProps<"/[locale]/[country]/[years]/origin">,
) {
  const params = use(props.params);
  const router = useRouter();

  useEffect(() => {
    router.replace(
      `/${params.locale}/${params.country}/${params.years}/origin/overview`,
    );
  }, []);

  return <Loading />;
}
