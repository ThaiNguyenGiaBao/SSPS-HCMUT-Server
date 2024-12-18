import { Request, Response  } from "express";
import { ConfigService } from "../services/config.service";
import { OK } from "../helper/successResponse";
import { PermitedFile } from "../model/permitedFile.model";
import { Config } from "../model/page.model";
import { ForbiddenError, NotFoundError } from "../helper/errorRespone";


class ConfigController {
  static async getConfigSettings(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    let result = await ConfigService.getPermitedFile({offset, limit});
    let config: Config  = await ConfigService.getPageConfig();
    return new OK({
      data: {
        "permitedFiles": result.data,
        "meta": result.meta,
        "config": config
      } ,
      message: "Get configuration successfully!"
    }).send(res);
  }

  static async getPermitedFile(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    const result = await ConfigService.getPermitedFile({offset, limit});
    return new OK({
      data: result,
      message: "Get permited file types successfully!"
    }).send(res);
  }

  static async addPermitedFile(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can add permitted file type.");
    const result = await ConfigService.addPermitedFile(req.body);
    return new OK({
      data: result,
      message: "Add permited file type successfully"
    }).send(res);
  }

  static async updatePermitedFile(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can update permitted file type.");
    const result = await ConfigService.updatePermitedFile(req.params.type, req.body);
    return new OK({
      data: result,
      message: "Permited file updated successfully!"
    }).send(res);
  } 

  static async deletePermitedFile(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can delete permitted file type.");
    const result = await ConfigService.deletePermitedFile(req.params.type);
    return new OK({
      data: result,
      message: "Delete permited file type successfully!"
    }).send(res);
  }

  static async getPageConfig(req: Request, res: Response) {
    const result = await ConfigService.getPageConfig();
    return new OK({
      data: result,
      message: "Get permited file types successfully!"
    }).send(res);
  }
  
  static async updatePageConfig(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can update page config.");
    const result = await ConfigService.updatePageConfig(req.body);
    return new OK({
      data: result,
      message: "Update page config successfully."
    }).send(res);
  }
};

export default ConfigController;