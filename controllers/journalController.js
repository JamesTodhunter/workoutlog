const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middlesware/validate-jwt");
const { JournalModel } = require("../models");


router.post('/log', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.journal;
    const { id } = req.user;
    const journalEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err })
    }
    JournalModel.create(journalEntry)
});

router.get("/log", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userJournal = await JournalModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userJournal);
    } catch (err) {
        res.status(500).json({ error: err });

    }
});


router.get("/log/:id", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userJournal = await JournalModel.findOne({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userJournal);
    } catch (err) {
        res.status(500).json({ error: err });

    }
});

router.put("/log/:id", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body;
    try {
        await JournalModel.update(
            { description, definition, result },
            { where: { id: req.params.id }, returning: true }
        ).then((result) => {
            res.status(200).json({ message: "new gain update", updatedLog: result });
        });
    } catch (err) {
        res.status(500).json({ message: `Log not updated!! ${err}` });
    }
});

router.delete("/log/:id", validateJWT, async (req, res) => {
    const owner_id = req.user.id;
    const journalId = req.params.id;
    try {
        const query = {
            where: {
                id: journalId,
                id: owner_id
            }
        };

        await JournalModel.destroy(query)
        res.status(200).json({ message: "Gains unfortunately LOST!!" });
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router;