import React from 'react';

const Paragraph = ({ children, className = '', ...rest }) => {
    return (
        <p className={`text-surface-600 ${className}`} {...rest}>
            {children}
        </p>
    );
};

export default Paragraph;