import { Router } from "express";
// import { 
//     loginUser, 
//     logoutUser, 
//     registerUser, 
//     refreshAccessToken, 
//     changeCurrentPassword, 
//     getCurrentUser,
//     updateAccountDetails
// } from "../../controllers/User/xyzuser.controller.js";

// import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { updateUser, getUserById } from "../../controllers/User/user.controllers.js";


const router = Router()

// router.route("/register").post(registerUser)

// router.route("/login").post(loginUser)

//secured routes
// router.route("/logout").post(verifyJWT,  logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT, changeCurrentPassword)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)


router.route("/get-user-info").get(getUserById)
export default router