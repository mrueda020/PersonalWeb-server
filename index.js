const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 8080;

const { API_VERSION } = require("./config");
const CONNECTION_URL =
  "mongodb+srv://mrueda020:personalweb@webpersonal.q9h4g.mongodb.net/WebPersonal?retryWrites=true&w=majority";
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
