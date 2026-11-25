"use client";

import {
  Toaster,
  createToastManager,
} from "@donationwatch/ui/components/toast";
import { useEffect, useRef, useState } from "react";

export interface CitationToastEvent {
  id: number;
  message: string;
}

export function CitationToast({
  toastEvent,
}: {
  toastEvent: CitationToastEvent;
}) {
  const [toastManager] = useState(() => createToastManager());
  const lastAddedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastAddedIdRef.current === toastEvent.id) return;
    lastAddedIdRef.current = toastEvent.id;
    toastManager.add({
      type: "success",
      title: toastEvent.message,
      timeout: 3000,
    });
  }, [toastEvent.id, toastEvent.message, toastManager]);

  return <Toaster toastManager={toastManager} timeout={3000} />;
}
