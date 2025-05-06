import axios from "axios";
import type {
  AccountVerification,
  VerificationResponse,
  BatchVerificationResult,
} from "../types";

const API_BASE_URL = "http://localhost:3000/api";

export const verifySingleAccount = async (
  account: AccountVerification
): Promise<VerificationResponse> => {
  const response = await axios.post(`${API_BASE_URL}/verify-single`, account);
  return response.data;
};

export const verifyBatchAccounts = async (
  accounts: AccountVerification[]
): Promise<{ results: BatchVerificationResult[] }> => {
  const response = await axios.post(`${API_BASE_URL}/verify-batch`, {
    accounts,
  });
  return response.data;
};
