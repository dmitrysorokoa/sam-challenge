declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg" {
  import { FC, SVGProps } from "react";
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  const content: { [className: string]: string };
  export default content;
}
