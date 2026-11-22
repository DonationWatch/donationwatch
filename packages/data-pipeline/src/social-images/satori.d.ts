export {};

declare module "react" {
  interface HTMLAttributes<T> {
    tw?: string;
  }

  interface SVGAttributes<T> {
    tw?: string;
  }
}
