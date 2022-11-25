import path from "path";

export default (app, __dirname) => {
  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "/static", "/index.html"));
  });
};
