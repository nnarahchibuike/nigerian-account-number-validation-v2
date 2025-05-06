import express, { RequestHandler } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios, { AxiosError } from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Paystack API configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface AccountVerificationRequest {
  accountNumber: string;
  bankCode: string;
}

interface BatchVerificationRequest {
  accounts: AccountVerificationRequest[];
}

// Single account verification endpoint
const verifySingleHandler: RequestHandler = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body as AccountVerificationRequest;

    if (!accountNumber || !bankCode) {
      res
        .status(400)
        .json({ error: "Account number and bank code are required" });
      return;
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(
        "Verification error:",
        error.response?.data || error.message
      );
      res.status(error.response?.status || 500).json({
        error:
          error.response?.data?.message ||
          "An error occurred during verification",
      });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

// Batch verification endpoint
const verifyBatchHandler: RequestHandler = async (req, res) => {
  try {
    const { accounts } = req.body as BatchVerificationRequest;

    if (!Array.isArray(accounts)) {
      res.status(400).json({ error: "Accounts must be an array" });
      return;
    }

    const results = await Promise.all(
      accounts.map(async (account) => {
        try {
          const response = await axios.get(
            `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${account.accountNumber}&bank_code=${account.bankCode}`,
            {
              headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
              },
            }
          );
          return {
            ...account,
            status: "success",
            data: response.data.data,
          };
        } catch (error) {
          if (error instanceof AxiosError) {
            return {
              ...account,
              status: "error",
              error: error.response?.data?.message || "Verification failed",
            };
          }
          return {
            ...account,
            status: "error",
            error: "An unexpected error occurred",
          };
        }
      })
    );

    res.json({ results });
  } catch (error) {
    console.error("Batch verification error:", error);
    res
      .status(500)
      .json({ error: "An error occurred during batch verification" });
  }
};

app.post("/api/verify-single", verifySingleHandler);
app.post("/api/verify-batch", verifyBatchHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
