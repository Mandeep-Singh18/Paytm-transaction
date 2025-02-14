const { Router } = require("express");
const { Account } = require("../db");
const { authmiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");
const router = Router();


// Route: "/api/v1/account/balance" for getting account balance
router.get("/balance", authmiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    res.json({
        balance: account.balance
    })
});


// Route: "/api/v1/account/tranfer" for  money

router.post("/transfer", authmiddleware, async (req, res) => {
    const session = await mongoose.startSession();  // uses session to make sure both the transactions are done or none of them are done

    session.startTransaction();
    try {
        const { amount, to } = req.body;

        //fetching the account for transaction
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Insufficient balance"
            })
        }

        const toaccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toaccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Account not found"
            })
        }

        //performing the transaction by updating the balance
        await Account.updateOne({
            userId: req.userId
        }, {
            $inc: {
                balance: -amount
            }
        }).session(session);
        await Account.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount
            }
        }).session(session);

        //commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Money transfered successfully"
        })
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({
            message: "Error while transferring money"
        });
    } finally {
        session.endSession();
    }
});


module.exports = router;