const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/CourseController");

const verifyToken = require("../middleware/auth");

router.post("/new-meeting", coursesController.newMeeting);
router.delete("/delete", verifyToken, coursesController.delete);
router.put("/update", verifyToken, coursesController.update);
router.put("/update-zoom-link", verifyToken, coursesController.updateZoomLink);
router.put("/rate", verifyToken, coursesController.rate);
router.post("/create", coursesController.create);
router.get("/my-courses", coursesController.getMyCourses);
router.get("/search", coursesController.search);

module.exports = router;
