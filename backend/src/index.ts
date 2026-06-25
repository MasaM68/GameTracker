import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { Review } from "./entities/Review.js";
import { WatchStatus } from "./entities/WatchStatus.js";
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [User, Review, WatchStatus],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((e) => console.log("Connection error:", e));

app.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const existingUser = await userRepo.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists! 🌸" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepo.create({
            username,
            email,
            password: hashedPassword 
        });

        await userRepo.save(newUser);
        res.status(201).json({ message: "Registration successful! ✨" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration", error });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOneBy({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const { password: _, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await AppDataSource.getRepository(User).find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error reading database", error });
    }
});

app.get("/watch-status/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const watchData = await AppDataSource.getRepository(WatchStatus).findBy({ userId });
        const reviews = await AppDataSource.getRepository(Review).findBy({ userId });

        const mergedData = watchData.map(item => {
            const review = reviews.find(r => r.animeId === item.animeId);
            return {
                ...item,
                rating: review ? review.rating : 0,
                comment: review ? review.comment : "" 
            };
        });

        res.json(mergedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});

app.post("/watch-status", async (req, res) => {
    try {
        const { userId, animeId, status, title, imageUrl, rating, comment } = req.body;
        const watchRepo = AppDataSource.getRepository(WatchStatus);
        
        let existingStatus = await watchRepo.findOneBy({ userId, animeId });
        
        if (existingStatus) {
            existingStatus.status = status;
            await watchRepo.save(existingStatus);
        } else {
            const newStatus = watchRepo.create({ 
                userId, 
                animeId, 
                status, 
                title, 
                imageUrl, 
                isFavorite: 0 
            } as any);
            await watchRepo.save(newStatus);
        }

        if (rating && rating > 0) {
            const reviewRepo = AppDataSource.getRepository(Review);
            let existingReview = await reviewRepo.findOneBy({ userId, animeId });
            
            if (existingReview) {
                existingReview.rating = Number(rating);
                existingReview.comment = comment;
                await reviewRepo.save(existingReview);
            } else {
                const newReview = reviewRepo.create({
                    userId: Number(userId),
                    animeId: Number(animeId),
                    rating: Number(rating),
                    comment: comment
                });
                await reviewRepo.save(newReview);
            }
        }

        res.status(201).json({ message: "Saved successfully!" });
    } catch (e) {
        console.error("SQL ERROR:", e);
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.delete("/watch-status/:userId/:animeId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const animeId = Number(req.params.animeId);

        await AppDataSource.getRepository(WatchStatus).delete({ userId, animeId });
        await AppDataSource.getRepository(Review).delete({ userId, animeId });

        res.json({ message: "Removed from list and reviews!" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});