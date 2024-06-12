export const formatPostDate = (createdAt) => {
	const currentDate = new Date();
	const postDate = new Date(createdAt);

	const timeDifferenceInSeconds = Math.floor((currentDate - postDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) {
		return "1d";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours}h`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes}m`;
	} else {
		return "Just now";
	}
};

export const formatMemberSinceDate = (createdAt) => {
	const memberSinceDate = new Date(createdAt);
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const month = months[memberSinceDate.getMonth()];
	const year = memberSinceDate.getFullYear();
	return `Joined ${month} ${year}`;
};
