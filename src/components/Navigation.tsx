import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bank Account Verification
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/" sx={{ mx: 1 }}>
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/single"
            sx={{ mx: 1 }}
          >
            Single Verification
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/batch"
            sx={{ mx: 1 }}
          >
            Batch Verification
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
