import React from 'react';
import Label from '@/components/atoms/Label';

const FormField = ({ label, id, children, className = '' }) => {
    return (
        <div className={className}>
            {label && <Label htmlFor={id} className="mb-2">{label}</Label>}
            {React.cloneElement(children, { id })}
        </div>
    );
};

export default FormField;