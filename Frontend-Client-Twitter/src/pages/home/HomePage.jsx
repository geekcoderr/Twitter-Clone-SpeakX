import { useState } from "react"; // Import useState from React

import Posts from "../../components/common/Posts"; // Import Posts component
import CreatePost from "./CreatePost"; // Import CreatePost component

const HomePage = () => {
    const [feedType, setFeedType] = useState("forYou"); // State for feed type

    return (
        <>
            <div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'> {/* Main container */}
                {/* Header */}
                <div className='flex w-full border-b border-gray-700'>
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("forYou")}
                    >
                        For you
                        {feedType === "forYou" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div> {/* Feed type: For You */}
                    
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("following")}
                    >
                        Following
                        {feedType === "following" && (
                            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
                        )}
                    </div> {/* Feed type: Following */}
                </div>

                {/* Create Post Input */}
                <CreatePost />

                {/* Posts */}
                <Posts feedType={feedType} />
            </div>
        </>
    );
};
export default HomePage; // Export HomePage component
