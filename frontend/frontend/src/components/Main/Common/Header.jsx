import { FaArrowRightFromBracket } from "react-icons/fa6";
import Button from "../../Home/Common/Button";

const Header = () => {
  return (
      <div className="flex justify-between border h-full items-center px-4">
        <div>
          <h1 className="text-xl">Hello <span className="font-bold">Gabriel</span></h1>
        </div>
        <div className="flex items-center gap-8">
          <Button text="Add New Project"
          className="text-gray-100"/>
          <FaArrowRightFromBracket size={20} color="#960057" />
        </div>
      </div>
  );
}

export default Header