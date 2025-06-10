import React from 'react';

const Textarea = ({ className = '', value, onChange, placeholder, rows = 2, ...rest }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none ${className}`}
            rows={rows}
            {...rest}
        />
    );
};

export default Textarea;