const router = require('express').Router();
const { UniqueConstraintError } = require('sequelize/lib/errors');
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
    let { userName, password } = req.body.user;
    console.log(req.body.user);
    try {
        const User = await UserModel.create({
            userName,
            password: bcrypt.hashSync(password, 13)
        });
        console.log(UserModel)

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User Successfully created!",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: err,
            });
        } else {
            res.status(500).json({
                message: err,
            });
        }
    }
});

router.post("/login", async (req, res) => {
    let { userName, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                userName: userName,
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {

                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Poppycock login failed!"
                });
            }

        } else {
            res.status(401).json({
                message: "Poppysock login failed!"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "We got a 23-19 again!"
        })
    }
});

module.exports = router;