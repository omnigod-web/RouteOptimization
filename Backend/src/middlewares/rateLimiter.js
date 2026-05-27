import rateLimit from "express-rate-limit";

export const rateLimiter= rateLimit({
    windowMs: 15 * 60 * 1000,
    max:10,
    message: {error:"try ater 15 mins"}
}) 
