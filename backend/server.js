import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import MessageRoutes from "./routes/auth.message.js";
import userRoute from "./routes/user.routes.js";

import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB.js";

import {app, server} from './socket/socket.js';



const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/messages",MessageRoutes)
app.use("/api/users",userRoute)



server.listen(PORT, async () => {
	
	console.log(`Server Running on port ${PORT}`);
	await connectToMongoDB();
});