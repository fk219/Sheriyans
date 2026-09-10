import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
    MISTRALAI_API_KEY: process.env.MISTRALAI_API_KEY || "",
    COHERE_API_KEY: process.env.COHERE_API_KEY || "",
}

export default config;
