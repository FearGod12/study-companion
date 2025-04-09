import { ButtonProps } from "@/interfaces/interface";

const Button = ({ text, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
                flex items-center justify-center gap-4 px-12 py-3 rounded-xl bg-accent font-bold lg:text-lg md:text-base text-sm transition duration-500 ease-in-out shadow shadow-accent ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
