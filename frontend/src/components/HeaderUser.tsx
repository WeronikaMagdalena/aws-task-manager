import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";
import { Avatar } from "@mui/material";
import { useMemo } from "react";

const HeaderUser = () => {
  const avatar = useMemo(() => {
    return createAvatar(lorelei, {
      size: 128,
    }).toDataUri();
  }, []);

  const svg = avatar.toString();

  return <Avatar src={svg} />;
};

export default HeaderUser;
