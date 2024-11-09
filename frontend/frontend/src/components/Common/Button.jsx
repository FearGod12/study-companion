import classnames from "classnames";

const Button = ({ text, link, type = "button", justify = "center", marginTop = 0, bgColor = "secondary", textColor = "gray-100"}) => {
    return (
        <div
            className={classnames("flex", {
                [`justify-${justify}`]: justify, // Dynamically apply justify content
                [`mt-${marginTop}`]: marginTop, // Dynamically apply margin-top
            })}
        >
            <button
                type={type}
                className={classnames("px-12 py-2 rounded-3xl font-inria-sans text-sm transition ease-in-out duration-500 hover:text-secondary hover:bg-gray-100 font-bold hover:border border-secondary shadow-lg", {
                    [`bg-${bgColor}`]: bgColor,
                    [`text-${textColor}`]: textColor,
                })}
            >
                {link}
                {text}
            </button>
        </div>
    );
};

export default Button;
