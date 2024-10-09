import express from "express";
import { Request, Response } from "express";
import AccessRouter from "./access";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
router.use("/v1/api/auth", AccessRouter);

export default router;
