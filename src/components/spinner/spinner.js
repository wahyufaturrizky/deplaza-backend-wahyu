import React from "react";
import Loader from "react-loader-spinner";
import "./spinner.css";

export const Spinner = () => {
  return (
      <div className="spinner">
        <Loader type="ThreeDots" color="#2BAD60" height="50" width="50"/>
      </div>
    )
};