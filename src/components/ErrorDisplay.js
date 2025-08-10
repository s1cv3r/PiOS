import React from 'react';

const ErrorDisplay = ({ message }) => (
  <div className="p-4 m-4 bg-red-100 text-red-700 border border-red-200 rounded-lg">
    <p><strong>Error:</strong> {message}</p>
  </div>
);

export default ErrorDisplay;
