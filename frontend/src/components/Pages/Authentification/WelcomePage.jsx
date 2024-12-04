import Hero from "../../common/Hero";
import WelcomeHeader from "../../common/WelcomeHeader";
import background from "../../../assets/Image/hero-img.png";
import Carousel from "../../common/Carousel";

const WelcomePage = () => {
    return (
        <div className="container max-w-none overflow-x-hidden w-screen flex flex-col">
            {/* Header */}
            <div className="z-10">
                <WelcomeHeader />
            </div>

            {/* Hero and Image Section  */}
            <section id="home" className="flex items-center justify-center h-screen bg-cover bg-center relative">
                <div className="flex flex-col md:flex-row items-center justify-between w-3/4 max-w-6xl mx-auto space-y-6 md:space-y-0 md:space-x-8">
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
                            loading="lazy"
                        />
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section id="feature" className="h-screen bg-gray-100 flex justify-center items-center bg-secondary">
                <Carousel />
            </section>
        </div>
    );
};

export default WelcomePage;
