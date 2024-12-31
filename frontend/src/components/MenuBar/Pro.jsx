import planImage from "../../assets/Image/img-3.png";
import useSubscription from "../../hooks/useSubscription";
import Button from "../common/Button";

const Pro = () => {
  const { loading, error, fetchPremium } = useSubscription();

  return (
    <div className="flex gap-1 pl-6 h-full text-gray-100 items-center">
      <div className="">
        <div className="mt-10">
      <div className="lg:flex md:flex hidden items-center justify-center">
        <img src={planImage} alt="Pro Plan"className="size-32"/>
      </div>
          <p className="font-ink-free text-sm lg:block md:block hidden">
           Upgrade to PRO for more features
          </p>
        </div>
        <Button
          text={loading ? "Loading..." : "Upgrade"}
          className="lg:mt-4 lg:mb-4 md:mt-4 md:mb-4 bg-white text-secondary transition ease-in-out duration-500 hover:scale-105 transform rotate-90 lg:rotate-0 md:rotate-0 -translate-x-16 lg:translate-x-0 md:translate-x-0 mt-24"
          onClick={fetchPremium}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Pro;
