const { Router } = require("express");
const { User,Account } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { authmiddleware } = require("../middleware");
const { JWT_SECRET } = require("../config");

const router = Router();


// Route: "/api/v1/user/signup" for signup
const signupbody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})

router.post("/signup", async(req, res) => {
    const { success } = signupbody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existinguser = await User.findOne({
        username: req.body.username
    })

    if(existinguser){
        return res.status(411).json({
            message: "email alredy taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    })

    const userId = user._id;

    //---- create a new accont for the user -----
    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })

    //----- account created -----

    const token = jwt.sign({ 
        userId: userId 
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token
    })

})


// Route: "/api/v1/user/sigin" for signin
const signinbody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async(req, res) => {
    const { success } = signinbody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(!user){
        return res.status(411).json({
            message: "Invalid credentials"
        })
    }

    if(user){
        const token = jwt.sign({ 
            userId: user._id
        }, JWT_SECRET);

        res.json({
            message: "User logged in successfully",
            token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in" 
    })
})



// Route: "/api/v1/user/" for updating user info using middleware
const updatebody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})

router.put("/", authmiddleware, async(req, res)=> {
    const { success } = updatebody.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message: "error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)

    res.json({
        message: "Updated succesfully"
    })

})


// Route: "/api/v1/user/bulk" for get user or friends 
router.get("/bulk", async(req, res) => {
    const filter = req.query.filter || "";

    const users =await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }  
        },{
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname:  user.lastname,
            _id: user._id 
        }))
    })
})

module.exports = router;

