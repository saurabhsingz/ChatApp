import { Box, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import moment from "moment";
import React, { memo } from "react";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ user, message }) => {
  const { attachements, content, sender, chat, createdAt } = message;
  console.log(attachements);
  const sameSender = user._id === sender._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        padding: "0.5rem",
        borderRadius: "5px",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant={"caption"}>
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}
      {attachements.length > 0 &&
        attachements.map((attachement, idx) => {
          const url = attachement.url;
          const file = fileFormat(url);
          return (
            <Box key={idx}>
              <a
                href={url}
                target={"_blank"}
                download
                style={{ color: "black" }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant={"caption"} color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </div>
  );
};

export default memo(MessageComponent);
