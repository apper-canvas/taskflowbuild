import React from 'react';

const Label = ({ children, className = '', htmlFor, ...rest }) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-surface-700 ${className}`} {...rest}>
            {children}
        </label>
    );
};

export default Label;