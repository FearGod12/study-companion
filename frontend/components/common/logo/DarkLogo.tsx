import Image from "next/image";

const DarkLogo = () => {
    return (
        <div className="w-20">
            <Image
                src='/image/topicaltest_image.png'
                alt="Topicaltest Dark"
                className=""
                width={80}
                height={80}
            />
        </div>
    );
};

export default DarkLogo;
