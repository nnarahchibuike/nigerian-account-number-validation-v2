import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Stack,
} from "@mui/material";
import { verifyBatchAccounts } from "../services/api";
import type { AccountVerification, BatchVerificationResult } from "../types";

export default function BatchVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<BatchVerificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseFile = async (file: File): Promise<AccountVerification[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.endsWith(".txt")) {
            // Parse text file with format: accountNumber,bankCode
            const accounts = content
              .split("\n")
              .filter((line) => line.trim())
              .map((line) => {
                const [accountNumber, bankCode] = line
                  .split(",")
                  .map((item) => item.trim());
                if (!accountNumber || !bankCode) {
                  throw new Error(
                    "Invalid format in text file. Each line should be: accountNumber,bankCode"
                  );
                }
                return { accountNumber, bankCode };
              });
            resolve(accounts);
          } else {
            // Parse JSON file
            const accounts = JSON.parse(content);
            if (!Array.isArray(accounts)) {
              throw new Error("File must contain an array of accounts");
            }
            resolve(accounts);
          }
        } catch (err) {
          reject(
            new Error(
              `Invalid file format: ${
                err instanceof Error
                  ? err.message
                  : "Please upload a valid file."
              }`
            )
          );
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const accounts = await parseFile(file);
      const response = await verifyBatchAccounts(accounts);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = [
      "Account Number",
      "Bank Code",
      "Status",
      "Account Name",
      "Error",
    ];
    const csvContent = [
      headers.join(","),
      ...results.map((result) =>
        [
          result.accountNumber,
          result.bankCode,
          result.status,
          result.data?.account_name || "",
          result.error || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "verification-results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 3,
            }}
          >
            Batch Account Verification
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <input
                accept=".json,.txt"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="batch-file-input"
              />
              <label htmlFor="batch-file-input" style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  component="span"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  Select File (.json or .txt)
                </Button>
              </label>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file || loading}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Verify Accounts"}
              </Button>
            </Stack>
          </form>

          {file && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Selected file: {file.name}
            </Typography>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {results.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  Results
                </Typography>
                <Button
                  onClick={exportToCSV}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Export to CSV
                </Button>
              </Stack>

              <TableContainer
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                  overflowX: "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Number</TableCell>
                      <TableCell>Bank Code</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <TableCell>{result.accountNumber}</TableCell>
                        <TableCell>{result.bankCode}</TableCell>
                        <TableCell>
                          <Alert
                            severity={
                              result.status === "success" ? "success" : "error"
                            }
                            sx={{
                              py: 0,
                              borderRadius: 1,
                              "& .MuiAlert-message": {
                                fontSize: "0.875rem",
                              },
                            }}
                          >
                            {result.status}
                          </Alert>
                        </TableCell>
                        <TableCell>
                          {result.data?.account_name || "-"}
                        </TableCell>
                        <TableCell>{result.error || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
