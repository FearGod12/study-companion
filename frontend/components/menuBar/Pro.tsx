import Image from "next/image";
import Button from "../common/Button";
import usePremiumStore from "@/store/usePremiumStore";
import { toast } from "react-toastify";

const Pro = () => {
  const { isSubscribed, goPremium, loading } = usePremiumStore();

  const handleGoPremium = async () => {
    try {
      await goPremium();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <>
      {!isSubscribed && (
        <div className="flex gap-1 pl-6 h-full text-gray-100 items-center">
          <div className="">
            <div className="mt-10">
              <div className="lg:flex hidden items-center justify-center">
                <Image
                  src="/image/img-3.png"
                  alt="Pro Plan"
                  className="size-32"
                  width={450}
                  height={450}
                />
              </div>
              <h1 className="text-sm lg:block hidden">
                {isSubscribed
                  ? "You are subscribed to Premium"
                  : "Upgrade to PRO for more features"}
              </h1>
            </div>
            <div className="lg:flex lg:justify-center">
              <Button
                text={loading ? "Processing..." : "Upgrade"}
                className="lg:mt-4 lg:mb-4 bg-gray-100 text-accent transition ease-in-out duration-500 hover:scale-105 transform rotate-90 lg:rotate-0 -translate-x-6 lg:translate-x-0 md:-translate-x-8 mt-42 p-2"
                onClick={handleGoPremium}
                disabled={loading}
                aria-label="Subscribe to Premium Plan"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pro;
