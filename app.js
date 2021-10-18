require("dotenv").config();
const Express = require("express");
const controllers = require("./controllers");
const app = Express();
const dbconnection = require("./db")

// app.use('/test', (req, res) => {
//     res.send('Is this working??')
// });

app.use(Express.json());

app.use("/user", controllers.userController);

app.use(require("./middlesware/validate-jwt"));
app.use("/journal", controllers.journalController);



dbconnection.authenticate()
    .then(() => dbconnection.sync())
    .then(() => {
        app.listen(5000, () => {
            console.log(`[Server]: App is listening on 5000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error= ${err}`);
    });


