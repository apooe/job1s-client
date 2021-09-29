import React from "react";
import { CircularProgress } from "@material-ui/core";

const Loader = () => {
  return (
    <div className="loader-container">
      <CircularProgress />
    </div>
  );
};

export default Loader;
