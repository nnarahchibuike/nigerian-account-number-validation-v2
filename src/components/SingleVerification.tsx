import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { verifySingleAccount } from "../services/api";
import type { AccountVerification, VerificationResponse } from "../types";

export default function SingleVerification() {
  const [formData, setFormData] = useState<AccountVerification>({
    accountNumber: "",
    bankCode: "",
  });
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifySingleAccount(formData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Single Account Verification
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Bank Code"
            name="bankCode"
            value={formData.bankCode}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Verify Account"}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={result.status ? "success" : "error"}>
              {result.message}
            </Alert>
            {result.data && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Account Details:</Typography>
                <Typography>
                  Account Name: {result.data.account_name}
                </Typography>
                <Typography>
                  Account Number: {result.data.account_number}
                </Typography>
                <Typography>Bank ID: {result.data.bank_id}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
