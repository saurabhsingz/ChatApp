import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorE1 }) => {
  return (
    <Menu anchorEl={anchorE1} open={false}>
      <div style={{ width: "10rem" }}>
        {" "}
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi
        laboriosam quidem reiciendis sed harum cumque, dignissimos corrupti ex,
        quae similique error, quasi incidunt! Eveniet magnam quia esse atque
        consectetur et!{" "}
      </div>
    </Menu>
  );
};

export default FileMenu;
