import React from "react";
import { Link } from "react-router-dom";

const ProfileImage = ({ src }) => {
  return (
    <Link to={"/settings"}>
      <img src={src} alt={"Profile"} className="object-cover" />
    </Link>
  );
};

export default ProfileImage;
