import Image from "next/image";

const LightLogo = () => {
  return (
    <div className="w-20">
      <Image
        src="/image/topicaltest_image-2.png"
        alt="Topicaltest Logo"
        className=""
        width={80}
        height={80}
      />
    </div>
  );
};

export default LightLogo;
