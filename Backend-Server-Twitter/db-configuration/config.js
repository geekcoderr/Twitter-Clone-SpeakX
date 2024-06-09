import mongoose from "mongoose";

// connecting to mongodb database.
const connectWithRetry = async (retries = 5, wait = 5000) => {
	try {
		const connect = await mongoose.connect(process.env.MONGODB_ATLAS_API, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB Connected!');
	} catch (error) {
		console.error('MongoDB Connection Error!');
		console.error(error.stack);
		if (retries > 0) {
			console.log(`Retrying to connect in ${wait / 1000} seconds... (${retries} retries left)`);
			setTimeout(async () => {
				await connectWithRetry(retries - 1, wait);
			}, wait);
		} else {
			console.error('Could not connect to MongoDB after multiple attempts. Exiting.');
			process.exit(1);
		}
	}
};

const connectMongoDB = async () => {
	// connecting with retries.
	await connectWithRetry();
};

export default connectMongoDB;
