import type {
  Messages,
  NamespaceKeys,
  NestedKeyOf,
  createTranslator,
} from "next-intl";

export type StrictNamespacedTranslator<
  Namespace extends NamespaceKeys<Messages, NestedKeyOf<Messages>>,
> = (
  key: Parameters<ReturnType<typeof createTranslator<Messages, Namespace>>>[0],
  values?: Parameters<
    ReturnType<typeof createTranslator<Messages, Namespace>>
  >[1],
) => string;

export type RootTranslator = ReturnType<typeof createTranslator<Messages>>;
