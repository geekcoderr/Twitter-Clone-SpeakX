const RightPanelSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 w-52 my-2'> {/* Container for right panel skeleton */}
            <div className='flex gap-2 items-center'> {/* Flex container for user information */}
                <div className='skeleton w-8 h-8 rounded-full shrink-0'></div> {/* Skeleton for user avatar */}
                <div className='flex flex-1 justify-between'> {/* Flex container for user details */}
                    <div className='flex flex-col gap-1'> {/* Container for user details */}
                        <div className='skeleton h-2 w-12 rounded-full'></div> {/* Skeleton for username */}
                        <div className='skeleton h-2 w-16 rounded-full'></div> {/* Skeleton for user status */}
                    </div>
                    <div className='skeleton h-6 w-14 rounded-full'></div> {/* Skeleton for follow button */}
                </div>
            </div>
        </div>
    );
};
export default RightPanelSkeleton; // Export RightPanelSkeleton component
