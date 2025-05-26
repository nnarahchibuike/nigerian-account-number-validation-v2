import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ReplayIcon from "@mui/icons-material/Replay";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface VerificationResult {
  date: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  reference: string;
  status: "success" | "failed";
}

export default function ResultsHistory() {
  // Replace with your actual state and logic
  const loading = true;
  const results: VerificationResult[] = [];

  return (
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
          maxWidth: 1100,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Verification Results
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          View and manage all account verification results.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={2}
          alignItems="center"
        >
          <TextField
            select
            label="All Results"
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All Results</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>
          <TextField
            select
            label="All Time"
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </TextField>
          <Box flex={1} />
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            CSV
          </Button>
          <Button
            startIcon={<FileDownloadOutlinedIcon />}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Excel
          </Button>
          <Button
            startIcon={<ReplayIcon />}
            variant="outlined"
            color="secondary"
            sx={{ minWidth: 120 }}
          >
            Retry Failed
          </Button>
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={2}
          alignItems="center"
        >
          <TextField
            placeholder="Search accounts"
            size="small"
            sx={{ minWidth: 250 }}
          />
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <TableContainer sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date ▼</TableCell>
                <TableCell>Account Number</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Account Name</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Loading verification results...
                  </TableCell>
                </TableRow>
              ) : results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.accountNumber}</TableCell>
                    <TableCell>{row.bankCode}</TableCell>
                    <TableCell>{row.accountName}</TableCell>
                    <TableCell>{row.reference}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button size="small" variant="text">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
