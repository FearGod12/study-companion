import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
    return (
        <div className="flex py-4 px-6 gap-12">
            <div className="outline outline-secondary p-12 rounded-full">
                <FaUserCircle size={70} />
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <p className="">
                    Full Name: 
                    <span className="font-bold font-ink-free ml-4"> Gabriel Williams</span>
                </p>
                <p className="">
                    Phone Number:
                    <span className="font-bold font-ink-free ml-4"> 08173442565</span>
                </p>
                <p className="">
                    Email:
                    <span className="font-bold font-ink-free ml-4"> Gabrielwilliams@gmail.com</span>
                </p>
                <p className="">
                    Address:
                    <span className="font-bold font-ink-free ml-4"> Aja, Lagos State</span>
                </p>
                <p className="">
                    Category:
                    <span className="font-bold font-ink-free ml-4"> Undergraduate</span>
                </p>
            </div>
        </div>
    );
};

export default Profile;
