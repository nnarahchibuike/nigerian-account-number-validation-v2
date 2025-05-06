import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Navigation from "./components/Navigation";
import SingleVerification from "./components/SingleVerification";
import BatchVerification from "./components/BatchVerification";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <h1>Welcome to Bank Account Verification</h1>
      <p>
        This application allows you to verify bank account details using the
        Paystack API. You can verify a single account or process multiple
        accounts in batch.
      </p>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/single" element={<SingleVerification />} />
            <Route path="/batch" element={<BatchVerification />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
