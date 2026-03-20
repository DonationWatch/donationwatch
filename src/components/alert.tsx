import type { ReactNode } from "react";

import { CircleCheck, CircleX, Info } from "lucide-react";

export const InfoAlert = ({ text }: { text: ReactNode }) => {
  return (
    <div
      role="note"
      className="flex rounded-sm border border-solid border-blue-700 bg-blue-50 p-2 text-sm dark:bg-blue-950"
    >
      <Info
        className="mr-1 inline shrink-0 align-text-bottom text-blue-700"
        height={16}
      />
      {text}
    </div>
  );
};

export const SuccessAlert = ({ text }: { text: ReactNode }) => {
  return (
    <div
      role="note"
      className="rounded-sm border border-solid border-green-700 bg-green-50 p-2 text-sm dark:bg-green-950"
    >
      <CircleCheck
        className="mr-1 inline align-text-bottom text-green-700"
        height={16}
      />
      {text}
    </div>
  );
};

export const ErrorAlert = ({ text }: { text: ReactNode }) => {
  return (
    <div
      role="note"
      className="rounded-sm border border-solid border-red-700 bg-red-50 p-2 text-sm dark:bg-red-950"
    >
      <CircleX
        className="mr-1 inline align-text-bottom text-red-700"
        height={16}
      />
      {text}
    </div>
  );
};
