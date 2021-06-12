const mongoose = require("mongoose");

const app = require("./app");
const PORT = process.env.PORT || 8080;

const { DB } = require("./config/config");
const CONNECTION_URL = DB;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
