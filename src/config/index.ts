import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };

  adjutor: {
    apiUrl: string;
  };
}

const validateConfig = () => {
  const required = ["DB_HOST", "DB_USER", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

validateConfig();

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME!,
  },

  adjutor: {
    apiUrl:
      process.env.ADJUTOR_API_URL ||
      "https://adjutor.lendsqr.com/v2/verification/karma",
  },
};

export default config;