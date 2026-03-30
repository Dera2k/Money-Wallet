import dotenv from "dotenv";
import path from "path";

dotenv.config ({path: path.resolve(__dirname, "../../.env")});

interface Config {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: String;
    };
    adjutor: {
        apiUrl: string
    };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'wallet_db',
  },
  adjutor: {
    apiUrl: process.env.ADJUTOR_API_URL || 'https://adjutor.lendsqr.com/v2/verification/karma',
  },
};
// validation 
const validateConfig =()=> {
    const required = [
        'DB_HOST',
        'DB_USER',
        'DB_NAME',
    ];

    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

validateConfig();
export default config;