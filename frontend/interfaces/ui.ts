import { ButtonHTMLAttributes, JSX, ReactNode } from "react";
import { StudySessionData } from "./session";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | JSX.Element;
  className?: string;
  loading?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ProgressBarProps {
  timeLeft: number;
  currentSession: StudySessionData;
}

export interface HeaderProps {
  currentSession: StudySessionData;
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  changeBackground: (bgImage: string) => void;
  backgroundOptions: string[];
  handleEndSession: (scheduleId: string) => void;
  loading: boolean;
}

export interface BackgroundSectionProps {
  bgImage: string;
  timeLeft: number;
}

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  bgColor?: string;
}

export interface MenuItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

export interface OtpInputProps {
  name: string;
  length?: number;
}