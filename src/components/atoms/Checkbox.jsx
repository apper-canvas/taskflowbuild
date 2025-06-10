import React from 'react';

const Checkbox = ({ className = '', checked, onChange, ...rest }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={`rounded border-surface-300 text-primary focus:ring-primary focus:ring-offset-0 ${className}`}
            {...rest}
        />
    );
};

export default Checkbox;