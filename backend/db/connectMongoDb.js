import mongoose from 'mongoose';

// connect mongoDB
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erorr connecting to mongo db : ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
