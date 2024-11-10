import Hero from "../Common/Hero";
import Header from "../Header";
import background from "../../../assets/Image/hero-img.png";

const WelcomePage = () => {
    return (
        <div className="container max-w-none overflow-x-hidden h-screen w-screen flex flex-col">
            {/* Header */}
            <div className="z-10">
                <Header />
            </div>

            {/* Hero and Image Section */}
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col md:flex-row items-center justify-between w-3/4 max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-8 mt-6">
                    {/* Hero Component */}
                    <div className="flex-1">
                        <Hero />
                    </div>

                    {/* Background Image */}
                    <div className="flex-1 lg:flex md:flex hidden justify-center">
                        <img
                            src={background}
                            alt="background image"
                            className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
