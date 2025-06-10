import React from 'react';

const Input = ({ className = '', type = 'text', value, onChange, placeholder, autoFocus = false, ...rest }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
            autoFocus={autoFocus}
            {...rest}
        />
    );
};

export default Input;