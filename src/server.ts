import app from "./app";
import config from "./config";

const port: number = config.port;

app.listen(port, () => {
  console.log(`Vehicle Rental Backend API is running on port ${port}`);
});
