import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/Color";

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

export const StyledLink = styled(Link)({
  textDecoration: "none",
  color: "black",
  padding: "1rem",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
});

export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

export const SearchField = styled("input")`
  padding: 1rem 2rem;
  width: 20vmax;
  border: none;
  border-radius: 1.5rem;
  outline: none;
  background-color: ${grayColor};
  font-size: 1.1rem;
`;

export const CurvedButton = styled("button")`
  padding: 1rem 2rem;
  border: none;
  border-radius: 1.5rem;
  background-color: ${matBlack};
  outline: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;
