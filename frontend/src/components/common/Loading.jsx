const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-secondary">
            <img
                src={require("../../assets/Image/topicaltest_image.png")}
                alt="Loading image"
                className="w-32 h-32" 
                onError={(e) =>
                    (e.target.src = require("../../assets/Image/placeholder.png"))
                } 
            />
        </div>
    );
};

export default Loading;
