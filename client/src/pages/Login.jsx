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
import axios from "axios";
import { server } from "../constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";
import { useFileHandler } from "6pp";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [avatar, setAvatar] = useState(null);
  const avatar = useFileHandler("single");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username,
          password: password,
        },
        config
      );

      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("bio", bio);
    formData.append("avatar", avatar.file);
    console.log(avatar, avatar.file);

    console.log(avatar);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/newuser`,
        formData,
        config
      );
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
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
                    src={avatar.preview}
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
                        onChange={avatar.changeHandler}
                      />
                      <CameraAltIcon />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

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
