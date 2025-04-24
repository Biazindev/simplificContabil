import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`bg-white shadow-md rounded-xl p-4 w-full ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`border-b pb-2 mb-2 text-lg font-semibold ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`text-sm text-gray-700 ${className}`}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`border-t pt-2 mt-2 text-right ${className}`}>
            {children}
        </div>
    );
};
