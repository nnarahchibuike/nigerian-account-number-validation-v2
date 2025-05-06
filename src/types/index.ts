export interface AccountVerification {
  accountNumber: string;
  bankCode: string;
}

export interface VerificationResponse {
  status: boolean;
  message: string;
  data?: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export interface BatchVerificationResult {
  accountNumber: string;
  bankCode: string;
  status: "success" | "error";
  data?: VerificationResponse["data"];
  error?: string;
}

export interface Bank {
  name: string;
  code: string;
  longcode: string;
  slug: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}
