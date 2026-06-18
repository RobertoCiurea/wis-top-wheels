import React, { ComponentType, ElementType } from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  title?: string;
};

export type CardProps = {
    order: string
    Icon: {
        src: ComponentType<IconProps>
        color: string,
        size: number | string
    } 
    title: string
    text: string

}