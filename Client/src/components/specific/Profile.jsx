import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import AvatarCard from "../shared/AvatarCard";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";

const Profile = () => {
  return (
    <Stack direction={"column"} spacing={"2rem"} alignItems={"center"}>
      <Avatar
        sx={{
          width: "10rem",
          height: "10rem",
          objectFit: "contain",
          border: "0.1rem solid white",
          marginBottom: "1rem",
        }}
      />
      <ProfileCard text={"I am the best"} heading={"Bio"} />
      <ProfileCard
        text={"@saurabhsinghz"}
        heading={"Username"}
        Icon={UsernameIcon}
      />
      <ProfileCard
        text={"Saurabh Kumar Singh"}
        heading={"Name"}
        Icon={FaceIcon}
      />
      <ProfileCard
        text={moment("2024-04-18T00:00:00.000Z").fromNow()}
        heading={"Joined"}
        Icon={CalendarIcon}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, heading, Icon }) => {
  return (
    <Stack
      direction={"row"}
      spacing={"1rem"}
      alignItems="center"
      textAlign="center"
      color="white"
    >
      {Icon && <Icon />}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="caption" color="gray">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
