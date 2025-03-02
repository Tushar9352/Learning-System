// eslint-disable-next-line no-unused-vars
import React from "react";
import Sidebar from "./Sidebar";
import "./common.css";
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <div className="dashboard-admin">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
