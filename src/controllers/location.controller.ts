import { ForbiddenError } from "../helper/errorRespone";
import { Created, OK } from "../helper/successResponse";
import { Location } from "../model/location.model";
import LocationService from "../services/location.service";
import { Request, Response } from "express";

class LocationController {
  static async getLocation(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    const location: Partial<Location> = {
      ...(typeof req.query.campusname === 'string' && { campusname: req.query.campusname }),
      ...(typeof req.query.buildingname === 'string' && { buildingname: req.query.buildingname }),
      ...(typeof req.query.roomnumber === 'string' && { roomnumber: parseInt(req.query.roomnumber, 10) }),
      ...(typeof req.query.id === 'string' && { id: req.query.id }),
    };

    let result = null;
    if (Object.values(location).every(value => !value))
      result = await LocationService.getAllLocation({offset, limit});
    else
      result = await LocationService.getLocation(location, {offset, limit});
    return new OK({
      data: result,
      message: "Get locations successfully"
    }).send(res);
  }

  static async insertLocation(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can add a printer.");

    const location: Location = {
      campusname: req.body.campusname,
      buildingname: req.body.buildingname,
      roomnumber: parseInt(req.body.roomnumber),
      id: "dummy"
    }
    const result = await LocationService.insertLocation(location);
    return new Created({
      message: "Location added successfully",
      data: result,
    }).send(res);
  }

  static async deleteLocation(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can add a printer.");

    const result = await LocationService.deleteLocation(req.params.id);
    return new OK({
      message: "Delete Location successfully.",
      data: result
    }).send(res);
  }

  static async updateLocation(req: Request, res: Response) {
    if(req.user.role != "admin") throw new ForbiddenError("Only admin can add a printer.");

    const result = await LocationService.updateLocation(req.params.id, req.body);
    return new OK({
      message: "Update location successfully",
      data: result
    }).send(res);
  }
}

export default LocationController;