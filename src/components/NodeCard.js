import React from 'react';

const NodeCard = ({ status }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="font-semibold text-gray-800 mb-2">Node Status</h3>
    {status ? (
      <ul>
        {Object.entries(status).map(([nodeName, nodeData]) => (
          <li key={nodeName}>
            <strong>{nodeName}:</strong> {nodeData.status}
          </li>
        ))}
      </ul>
    ) : (
      <p>Node status not available.</p>
    )}
  </div>
);

export default NodeCard;
