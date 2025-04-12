import Image from "next/image";
import Button from "../common/Button";
import usePremiumStore from "@/store/usePremiumStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Pro = () => {
  const { isSubscribed, subscribeToPremium, loading, error } = usePremiumStore();
  const [subscriptionUrl, setSubscriptionUrl] = useState<string | null>(null); 
  
  useEffect(() => {
    if (subscriptionUrl) {
      window.location.href = subscriptionUrl;
    }
  }, [subscriptionUrl]);

  // Handler for subscription button click
  const handleSubscribe = async () => {
    try {
      const response = await subscribeToPremium();
      if (response.success) {
        setSubscriptionUrl(response.data.subscription_url); 
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
  };

  return (
    <div className="flex gap-1 pl-6 h-full text-gray-100 items-center">
      <div className="">
        <div className="mt-10">
          <div className="lg:flex md:flex hidden items-center justify-center">
            <Image
              src="/image/img-3.png"
              alt="Pro Plan"
              className="size-32"
              width={32}
              height={32}
            />
          </div>
          <h1 className="text-sm lg:block md:block hidden">
            {isSubscribed
              ? "You are subscribed to Premium"
              : "Upgrade to PRO for more features"}
          </h1>
        </div>
        <Button
          text={
            loading
              ? "Subscribing..."
              : isSubscribed
              ? "Already Subscribed"
              : "Subscribe to Premium"
          }
          className="lg:mt-4 lg:mb-4 md:mt-4 md:mb-4 bg-white text-accent transition ease-in-out duration-500 hover:scale-105 transform rotate-90 lg:rotate-0 md:rotate-0 -translate-x-16 lg:translate-x-0 md:translate-x-0 mt-24"
          onClick={handleSubscribe}
          disabled={loading}
          aria-label="Subscribe to Premium Plan"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Pro;
