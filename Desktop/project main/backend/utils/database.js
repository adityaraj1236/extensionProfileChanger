import mongoose from "mongoose";

const databaseConnection = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log(`Connecting to database at: ${uri}`);  // Debugging line
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = databaseConnection;
