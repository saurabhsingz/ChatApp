import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";

const Search = () => {
  const [users, setUsers] = useState(sampleUsers);

  let isLoadingSendFriendRequest = false;
  const addFriendHandler = (id) => {
    console.log("Add friend", id);
  };
  return (
    <Dialog open={true}>
      <Stack
        padding={"2rem"}
        alignItems={"center"}
        width={"25rem"}
        textAlign={"center"}
      >
        <DialogTitle>Find People</DialogTitle>
        <TextField
          label=""
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List
          sx={{
            width: "100%",
          }}
        >
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
