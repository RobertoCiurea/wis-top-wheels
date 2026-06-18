import * as React from "react";
import { IconProps } from "@/app/types/types";


export const ShieldIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, title, className, ...props }, ref) => {
    const titleId = React.useId();

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="none"
        role={title ? "img" : "presentation"}
        aria-hidden={title ? undefined : true}
        aria-labelledby={title ? titleId : undefined}
        className={className}
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
      <path
       fill="currentColor"
       d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64zM320 130.8L320 508.9C458 442.1 495.1 294.1 496 205.5L320 130.9L320 130.9z"/>
    
      </svg>
    );
  }
);

ShieldIcon.displayName = "ShieldIcon";