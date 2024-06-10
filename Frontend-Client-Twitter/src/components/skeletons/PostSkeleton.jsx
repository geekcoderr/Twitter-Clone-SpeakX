const PostSkeleton = () => {
    return (
        <div className='flex flex-col gap-4 w-full p-4'> {/* Container for post skeleton */}
            <div className='flex gap-4 items-center'> {/* Flex container for user information */}
                <div className='skeleton w-11 h-11 rounded-full shrink-0'></div> {/* Skeleton for user avatar */}
                <div className='flex flex-col gap-2'> {/* Container for user details */}
                    <div className='skeleton h-3 w-12 rounded-full'></div> {/* Skeleton for username */}
                    <div className='skeleton h-3 w-24 rounded-full'></div> {/* Skeleton for post timestamp */}
                </div>
            </div>
            <div className='skeleton h-40 w-full'></div> {/* Skeleton for post content */}
        </div>
    );
};
export default PostSkeleton; // Export PostSkeleton component
