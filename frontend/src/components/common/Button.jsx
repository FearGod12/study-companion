import classnames from 'classnames';

const Button = ({ text, type, className, loading = false, ...props }) => {
    return (
        <button
            type={type}
            className={classnames(
                "flex items-center justify-center gap-4 px-12 py-2 rounded-xl bg-secondary font-bold text-sm transition duration-500 ease-in-out shadow-md shadow-secondary",
                className
            )}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                    ></path>
                </svg>
            )}
            {text}
        </button>
    );
};

export default Button;
