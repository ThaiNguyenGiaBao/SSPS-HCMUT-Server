import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "../helper/errorRespone";

import { Printer } from "../model/printer.model";
import PrinterModel from "../model/printer.model";
import { checkUUID } from "../utils";

class PrinterService {
    static async getAllPrinter({ offset, limit }: { offset: number; limit: number }) {
        const result = await PrinterModel.findAllPrinter({ offset, limit });
        return result;
    }

    static async getPrinterByID(printerID: string): Promise<Printer> {
        if (!printerID) {
            throw new BadRequestError("Printer ID is required.");
        }
        const result: Printer | null = await PrinterModel.findPrinterByID(printerID);
        if (result === null) throw new NotFoundError("Cannot find the printer with ID " + printerID);
        return result;
    }

    static async addPrinter(printer: Printer): Promise<Printer> {
        // Check for mandatory attribute
        if (!printer.brand) throw new BadRequestError("Printer Brand is required");
        if (!printer.model) throw new BadRequestError("Printer Model is required");
        if (!printer.status) throw new BadRequestError("Printer Status is required");

        // Check for invalid type
        if (printer.status !== "enabled" && printer.status !== "disabled")
            throw new BadRequestError("Printer status must be 'enabled' or 'disabled'");

        if (printer.locationId && checkUUID(printer.locationId)) {
            throw new BadRequestError("Location ID must be type uuid.");
        }

        const result = await PrinterModel.createPrinter(printer);
        if (result === null) throw new InternalServerError("Cannot create the printer");
        return result;
    }

    static async removePrinter(printerID: string): Promise<Printer> {
        if (!printerID) throw new BadRequestError("Printer ID is required.");

        const result = await PrinterModel.deletePrinter(printerID);
        if (result === null) throw new NotFoundError("Cannot found the printer to delete");
        return result;
    }

    static async updatePrinter(printerID: string, data: Partial<Printer>): Promise<Printer> {
        if (!printerID) throw new BadRequestError("Printer ID is required.");

        const values = Object.values(data);
        values.forEach((value) => {
            if (!value) throw new BadRequestError("Updated value cannot be null | undefined!");
        });

        if (data.status && data.status !== "enabled" && data.status != "disabled")
            throw new BadRequestError("Printer status must be 'enabled' or 'disabled'");

        const result = await PrinterModel.updatePrinter(printerID, data);
        if (result === null) throw new NotFoundError("Not found the printer with ID " + printerID);
        return result;
    }
}

export default PrinterService;
