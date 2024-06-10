const ProfileHeaderSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 w-full my-2 p-4'> {/* Container for profile header skeleton */}
            <div className='flex gap-2 items-center'> {/* Flex container for profile header */}
                <div className='flex flex-1 gap-1'> {/* Flex container for profile details */}
                    <div className='flex flex-col gap-1 w-full'> {/* Container for profile details */}
                        <div className='skeleton h-4 w-12 rounded-full'></div> {/* Skeleton for profile name */}
                        <div className='skeleton h-4 w-16 rounded-full'></div> {/* Skeleton for profile username */}
                        <div className='skeleton h-40 w-full relative'> {/* Skeleton for profile cover photo */}
                            <div className='skeleton h-20 w-20 rounded-full border absolute -bottom-10 left-3'></div> {/* Skeleton for profile picture */}
                        </div>
                        <div className='skeleton h-6 mt-4 w-24 ml-auto rounded-full'></div> {/* Skeleton for follow button */}
                        <div className='skeleton h-4 w-14 rounded-full mt-4'></div> {/* Skeleton for profile bio */}
                        <div className='skeleton h-4 w-20 rounded-full'></div> {/* Skeleton for profile location */}
                        <div className='skeleton h-4 w-2/3 rounded-full'></div> {/* Skeleton for profile website */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProfileHeaderSkeleton; // Export ProfileHeaderSkeleton component
