import clsx from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    variant?: "default" | "outline"
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "default", className, ...props }) => {
    const baseClasses = "px-4 py-2 rounded font-semibold transition-all"
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    }

    return (
        <button
            className={clsx(baseClasses, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    )
}
