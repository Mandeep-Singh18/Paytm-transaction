const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authmiddleware = (req, res, next) => {
    const authheader = req.headers.authorization;

    if(!authheader || !authheader.startsWith("Bearer ")){ 
        return res.status(403).json({
            message: "Unauthorized"
        })
    }

    const token = authheader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            console.log(req.userId);
            next();
        } else {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
    } catch (error) {
        return res.status(403).json({
            message: "Unauthorized"
        })
    }
};

module.exports = {
    authmiddleware
}