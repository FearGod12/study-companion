import LightLogo from "../common/LightLogo";
import Button from "../common/Button";
import planImage from "../../assets/Image/img-3.png";
import useSubscription from "../../hooks/useSubscription";

const Subscription = () => {
  const { loading, error, fetchPremium } = useSubscription();

  return (
    <div className="flex gap-1 pl-6 h-full text-gray-100 items-center">
      <div className="">
        <LightLogo />
        <div className="mt-4">
          <h2 className="font-bold lg:text-xl md:text-xl">Go Premium</h2>
          <p className="font-ink-free text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </p>
        </div>
        <Button
          text={loading ? "Loading..." : "Get Access"}
          className="mt-4 mb-4 bg-white text-secondary transition ease-in-out duration-500 hover:scale-105"
          onClick={fetchPremium}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <div className="lg:flex hidden">
        <img src={planImage} alt="Subscription Plan" />
      </div>
    </div>
  );
};

export default Subscription;
