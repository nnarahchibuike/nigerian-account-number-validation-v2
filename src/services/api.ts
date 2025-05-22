import axios from "axios";
import type {
  AccountVerification,
  VerificationResponse,
  BatchVerificationResult,
} from "../types";

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://nigerian-account-number-validation-v2.onrender.com/api";

export const verifySingleAccount = async (
  account: AccountVerification
): Promise<VerificationResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-single`, account);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Verification failed");
    }
    throw error;
  }
};

export const verifyBatchAccounts = async (
  accounts: AccountVerification[]
): Promise<{ results: BatchVerificationResult[] }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-batch`, {
      accounts,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Batch verification failed"
      );
    }
    throw error;
  }
};
