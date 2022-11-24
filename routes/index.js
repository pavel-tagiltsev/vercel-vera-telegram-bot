import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (app) => {
  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "/public", "/index.html"));
  });
};
