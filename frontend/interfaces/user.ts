export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  category: string;
  address: string;
}

export interface UpdateFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category: string;
  address: string;
}

export interface Avatar {
  id: string;
  url: string;
  file: File;
}

export interface UserStore {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  uploadAvatar: (file: File) => Promise<void>;
  updateUserDetails: (userData: UpdateFormValues) => Promise<void>;
}
