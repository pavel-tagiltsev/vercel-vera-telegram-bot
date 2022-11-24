export default (app) => {
  app.get("/", (_, res) => {
    res.sendFile("../public/index.html");
  });
};
