import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bgGradient } from "../../constants/Color";
import { validateSecretKey } from "../../utils/Validator";

const isAdmin = true;

const AdminLogin = () => {
  const [secretKey, setSecretKey] = useState("");
  const [secretKeyError, setSecretKeyError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const submitHanlder = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isAdmin) {
      return navigate("/admin/dashboard");
    }
  }, []);

  return (
    <div style={{ background: bgGradient }}>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Admin Login</Typography>
          <form
            style={{ width: "100%", marginTop: "1rem" }}
            onSubmit={submitHanlder}
          >
            <TextField
              required
              fullWidth
              error={secretKeyError.length > 0}
              helperText={secretKeyError}
              margin="normal"
              label="Secret Key"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              sx={{ boxSizing: "border-box" }}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onBlur={(e) => validateSecretKey(e, setSecretKeyError)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ marginTop: "1rem" }}
            >
              LOGIN
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
