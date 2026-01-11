"use client";

import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

import Loading from "../../../../../../components/loading";

export default function OriginPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/origin">,
) {
  const params = use(props.params);
  const router = useRouter();

  useEffect(() => {
    router.replace(
      `/${params.locale}/${params.country}/party/${params.partyId}/origin/overview`,
    );
  }, []);

  return <Loading />;
}
