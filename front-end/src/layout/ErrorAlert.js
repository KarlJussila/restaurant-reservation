import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error, onClose }) {
  return (
    error && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
          Error: {error.message}
          {
              onClose ? (
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={onClose}>
                      <span aria-hidden="true">&times;</span>
                  </button>
              ) : <div></div>
          }
      </div>
    )
  );
}

export default ErrorAlert;
