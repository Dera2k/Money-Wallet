import app from "./app"
import config from './config';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Database: ${config.database.name}`);
    });
  }
   catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();