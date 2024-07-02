import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import {
  validateName,
  validatePassword,
  validateUsername,
} from "../utils/Validator";
import { bgGradient } from "../constants/Color";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleBlur = (e) => {
    if (e.target.value.length < 6) {
      // e.preventDefault();
      setPasswordError("Password should be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  const avatarHandler = (e) => {
    const avatarUrl = URL.createObjectURL(e.target.files[0]);
    setAvatar(avatarUrl);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login");
  };
  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup");
  };

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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) =>
                    validateUsername(
                      e.target.value,
                      setUsername,
                      setUsernameError
                    )
                  }
                  error={usernameError.length > 0}
                  helperText={usernameError}
                />

                <TextField
                  required
                  fullWidth
                  error={passwordError.length > 0}
                  helperText={passwordError}
                  margin="normal"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => validatePassword(e, setPasswordError)}
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
                <Typography textAlign={"center"} margin={"1rem"}>
                  Or
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  fullWidth
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleSignup}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      right: 0,
                      bottom: 0,
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={avatarHandler}
                      />
                      <CameraAltIcon />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => validateName(e.target.value, setName)}
                />
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) =>
                    validateUsername(
                      e.target.value,
                      setUsername,
                      setUsernameError
                    )
                  }
                  error={usernameError.length > 0}
                  helperText={usernameError}
                />
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Bio"
                  variant="outlined"
                  value={bio}
                  inputProps={{ maxLength: 30 }}
                  onChange={(e) => setBio(e.target.value)}
                />
                <TextField
                  required
                  fullWidth
                  error={passwordError.length > 0}
                  helperText={passwordError}
                  margin="normal"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => validatePassword(e, setPasswordError)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ marginTop: "1rem" }}
                >
                  SIGN UP
                </Button>
                <Typography textAlign={"center"} margin={"1rem"}>
                  Or
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  fullWidth
                  onClick={() => setIsLogin(true)}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
