const { authController } = require("../Controller/authController");
const { gameController } = require("../Controller/gameController");
const { userController } = require("../Controller/userController");
const upload = require("../helpers/multer");
const authentication = require("../middlewares/authentication");
const middlewareUpload = upload.single("file");

const router = require("express").Router();

router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/register", authController.register);

router.use(authentication);
router.post("/game", gameController.add);
router.get("/highscore", userController.highscore);
router.get("/users", userController.users);
router.get("/user", userController.fetchUser);
router.get("/tips", gameController.tips);
router.put("/users", middlewareUpload, userController.editProfile);
router.delete("/game/:id", gameController.delete);

module.exports = { router };
