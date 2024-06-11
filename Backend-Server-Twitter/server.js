import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import os from "os"; // To get network details


import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/tweet.js";
import userRoutes from "./routes/user.js";

import connectMongoDB from "./db-configuration/config.js";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "4mb" })); 
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Route to display a custom HTML page at the root URL
app.get("/", (req, res) => {
    const networkInterfaces = os.networkInterfaces();
    const networkDetails = Object.keys(networkInterfaces).map((iface) => {
        return networkInterfaces[iface].map((details) => {
            return `${iface}: ${details.address}`;
        }).join(", ");
    }).join("; ");

    const htmlContent = `
        <html>
            <head>
                <title>Server Status</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        text-align: center;
                        padding-top: 50px;
                    }
                    .container {
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        display: inline-block;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Server is Running</h1>
                    <p>Network details: ${networkDetails}</p>
                    <p>Port: ${PORT}</p>
                </div>
            </body>
        </html>
    `;

    res.send(htmlContent);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
