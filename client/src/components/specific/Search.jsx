import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import { useInputValidation } from "6pp";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import toast from "react-hot-toast";

const Search = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const search = useInputValidation("");

  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation();

  let isLoadingSendFriendRequest = false;
  const addFriendHandler = async (id) => {
    console.log("Add friend", id);
    try {
      const res = await sendFriendRequest({ receiverId: id });
      if (res.data) {
        console.log(res.data);
        toast.success("Friend request sent");
      } else {
        // toast.error(res.error.data.message);
        toast.error(
          res?.error?.data?.message?.message || "Failed to send friend request"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send friend request");
    }
  };
  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((error) => {
          console.log(error);
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
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
          value={search.value}
          onChange={search.changeHandler}
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
