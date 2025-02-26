// eslint-disable-next-line no-unused-vars
import React from "react";
import "./paymentsuccess.css";
import { Link, useParams } from "react-router-dom";
import PropTypes from 'prop-types';

const PaymentSuccess = ({ user }) => {
  const params = useParams();
  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          <h2>Payment successful</h2>
          <p>Your course subscription has been activated</p>
          <p>Reference no - {params.id}</p>
          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

PaymentSuccess.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
};

export default PaymentSuccess;