import { ButtonProps } from "@/interfaces";

const Button = ({ text, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
                flex items-center justify-center gap-4 rounded-xl bg-accent font-bold lg:text-base md:text-base text-sm transition duration-500 ease-in-out shadow shadow-accent ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
