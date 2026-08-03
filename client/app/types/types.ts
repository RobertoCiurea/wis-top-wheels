import React, { ComponentType, ElementType } from "react";
export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  title?: string;
};

export type CardProps = {
  order: string;
  Icon: {
    src: ComponentType<IconProps>;
    color: string;
    size: number | string;
  };
  title: string;
  text: string;
};

export type UserCardProps = {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken?: string;
  currentUserEmail: string;
};

export type ActionState = {
  status: number;
  error?: string;
  message?: string;
};
