import React from 'react';

const Heading = ({ level = 'h1', children, className = '', ...rest }) => {
    const Tag = level;
    return (
        <Tag className={`font-heading font-bold text-gray-900 ${className}`} {...rest}>
            {children}
        </Tag>
    );
};

export default Heading;