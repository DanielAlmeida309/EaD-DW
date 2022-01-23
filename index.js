const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./rotas/rotas")(app);
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
app.use(express.static('public'));