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

export type WheelAdProps = {
  id: number;
  status: string;
  url: string;
  title: string;
  description: string;

  contact: {
    name: string;
    phone: string;
  };

  location: {
    city_id: number;
    district_id: number | null;
    latitude: string;
    longitude: string;
  };

  images: {
    id: number | null;
    url: string;
  }[];

  price: {
    value: number;
    currency: string;
    negotiable: boolean;
  };

  attributes: {
    code: string;
    value: string;
  }[];

  created_at: string;
  activated_at: string;
  valid_to: string;

  category_id: number;

  advertiser_type: "private" | "business" | string;

  external_id: number | null;
  external_url: string | null;

  auto_extend_enabled: boolean;
};
