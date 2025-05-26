import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { verifyBatchAccounts } from "../services/api";
import type { AccountVerification, BatchVerificationResult } from "../types";

function parseCSV(content: string): AccountVerification[] {
  // Assumes first line is accountNumber,bankCode per line
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) => {
      const [accountNumber, bankCode] = line.split(",").map((s) => s.trim());
      if (!accountNumber || !bankCode)
        throw new Error("Invalid CSV/TXT format");
      return { accountNumber, bankCode };
    });
}

export default function BatchVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BatchVerificationResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const parseFile = async (file: File): Promise<AccountVerification[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.endsWith(".json")) {
            const accounts = JSON.parse(content);
            if (!Array.isArray(accounts))
              throw new Error("JSON must be an array");
            resolve(accounts);
          } else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
            resolve(parseCSV(content));
          } else {
            throw new Error("Unsupported file type");
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

  const handleBatchVerify = async () => {
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

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        minHeight="60vh"
        mt={4}
      >
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: 600,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={1}>
            Batch Account Verification
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Upload a file containing multiple account details for batch
            verification. Each record should include <b>account_number</b> and{" "}
            <b>bank_code</b>.
          </Typography>
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "primary.main" : "grey.300",
              borderRadius: 2,
              p: 4,
              mb: 3,
              textAlign: "center",
              background: dragActive ? "rgba(25, 118, 210, 0.04)" : "inherit",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={() => inputRef.current?.click()}
          >
            <CloudUploadIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
            <Typography>
              <span style={{ color: "#1976d2", fontWeight: 500 }}>
                Upload a file
              </span>{" "}
              or drag and drop
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CSV, JSON, or TXT up to 10MB. Files must include account_number
              and bank_code columns.
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.json,.txt"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
          {file && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              Selected file: <b>{file.name}</b>
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!file || loading}
            onClick={handleBatchVerify}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              "Start Batch Verification"
            )}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
      {results.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 4 },
              width: "100%",
              maxWidth: 900,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Batch Verification Results
            </Typography>
            <TableContainer>
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
                  {results.map((result, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{result.accountNumber}</TableCell>
                      <TableCell>{result.bankCode}</TableCell>
                      <TableCell>
                        <Alert
                          severity={
                            result.status === "success" ? "success" : "error"
                          }
                          sx={{ py: 0, borderRadius: 1 }}
                        >
                          {result.status}
                        </Alert>
                      </TableCell>
                      <TableCell>{result.data?.account_name || "-"}</TableCell>
                      <TableCell>{result.error || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </>
  );
}
