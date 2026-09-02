import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from 'dotenv';
import connectDB from './config/database.js';
import app from './app.js';
dotenv.config({
    path:'./.env'
});
const startServer = async() => {
	try {
        console.log('MONGO_URI:', process.env.MONGO_URI);
		await connectDB();

		app.on('error',(error) => {
			console.log('error',error);
			throw error;
		});
		app.listen(process.env.PORT || 8000, () => {
			console.log(`server is running at ${process.env.PORT}`);
		});
	} catch(error){
		console.log('MongoDB db connection failed',error);
	}
}
startServer();