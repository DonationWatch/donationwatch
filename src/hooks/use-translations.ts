"use client";

import { useContext } from "react";

import { TranslationContext } from "../app/providers";

export const useTranslations = () => {
  return useContext(TranslationContext);
};
