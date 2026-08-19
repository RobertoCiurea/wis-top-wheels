import React, {
  ComponentType,
  Dispatch,
  ElementType,
  SetStateAction,
} from "react";
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
  firstName: string;
  lastName: string;
  roles: string[];
  accessToken?: string;
  currentUserEmail?: string;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
};

export type ActionState = {
  status: number;
  error?: string;
  message?: string;
};

export type PasswordProps = {
  passwordTitle?: string;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  passwordsMatch: boolean;
};

export type WheelAdFormActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  formError?: string;
};
