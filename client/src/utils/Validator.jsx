export const validateName = (name, setName) => {
  const nameRegex = /^[a-zA-Z]+$/;

  // Check if the name matches the regex pattern
  if (!name.match(nameRegex)) {
    window.alert("Invlaide name!! Please enter a valid name");
    setName("");
  } else {
    setName(name);
  }
};
export const validateUsername = (username, setUsername, setUsernameError) => {
  const usernameRegex = /^[A-Za-z0-9]+([_@]?[A-Za-z0-9]+)*$/;

  // Check if the username matches the regex pattern
  setUsername(username);
  if (!username.match(usernameRegex)) {
    setUsernameError("Invalid username");
  } else {
    setUsernameError("");
  }
};

export const validatePassword = (e, setPasswordError) => {
  const password = e.target.value;
  if (password.length < 6) {
    e.preventDefault();
    setPasswordError("Password should be at least 6 characters long");
  } else {
    setPasswordError("");
  }
};

export const validateSecretKey = (e, setSecretKeyError) => {
  const secretKey = e.target.value;
  if (secretKey.length < 6) {
    e.preventDefault();
    setSecretKeyError("Password should be at least 6 characters long");
  } else {
    setSecretKeyError("");
  }
};
