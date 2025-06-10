import React from 'react';

const Tag = ({ tag, className = '' }) => {
    return (
        <span className={`px-2 py-1 bg-surface-100 text-surface-600 rounded text-xs ${className}`}>
            #{tag}
        </span>
    );
};

export default Tag;