import classnames from 'classnames';

const Button = ({ text, type = 'button', className = '', ...props }) => {
    return (
        <button
            type={type}
            className={classnames(
                "px-12 py-2 rounded-3xl bg-secondary font-bold text-sm transition duration-500 ease-in-out shadow-lg",
                className
            )}
            {...props}
        >
            {text}
        </button>
    );
};

export default Button;
