import AccessService from "../services/access.service";
import { Request, Response } from "express";
import { OK, Created } from "../helper/successResponse";

class AccessController {
    static async SignUp(req: Request, res: Response) {
        console.log("AccessController::SignUp", req.body);
        return new Created({
            message: "User created successfully",
            data: await AccessService.SignUp(req.body)
        }).send(res);
    }

    static async SignIn(req: Request, res: Response) {
        console.log("AccessController::SignIn", req.body);
        const { accessToken, ...data } = await AccessService.SignIn(req.body);
        res.cookie("token", accessToken, { httpOnly: true, secure: false, sameSite: "lax" });
        return new OK({
            message: "User signed in successfully",
            data: data
        }).send(res);
    }
}

export default AccessController;