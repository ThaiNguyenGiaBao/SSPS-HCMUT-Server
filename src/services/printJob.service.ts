import PrintJobModel from "../model/printJob.model";
import UserService from "../services/user.service";
import db from "../dbs/initDatabase";
import { BadRequestError, NotFoundError } from "../helper/errorRespone";

class PrintingJobService {
    static async getPrintJob(printJobId: string) {
        if (!printJobId) {
            throw new BadRequestError("Print Job Id is required");
        }
        return await PrintJobModel.getPrintJob(printJobId);
    }

    static async updateStatus({ printJobId, newStatus }: { printJobId: string; newStatus: string }) {
        if (!printJobId || !newStatus) {
            throw new BadRequestError("Print Job Id and new Status is required");
        }
        await PrintJobModel.updateStatus(printJobId, newStatus);
    }

    static async getPrintingHistoryByUserAndPrinter({
        userId,
        printerId,
        startDate,
        endDate
    }: {
        userId: string;
        printerId: string;
        startDate: string;
        endDate: string;
    }) {
        
        return await PrintJobModel.getPrintJobByUserAndPrinter({
            userId: userId,
            printerId: printerId,
            startDate: startDate,
            endDate: endDate
        });
    }

    static async savePrintJob({
        printerid,
        userid,
        fileid,
        papersize,
        numpage,
        numside,
        numcopy,
        pagepersheet,
        colortype,
        orientation,
        status
    }: {
        printerid: string;
        userid: string;
        fileid: string;
        papersize: string;
        numpage: number;
        numside: number;
        numcopy: number;
        pagepersheet: number;
        colortype: string;
        orientation: string;
        status: string;
    }) {
        const File = await db.query("SELECT * FROM file WHERE id = $1", [fileid]);
        if (File.rows.length == 0) {
            throw new NotFoundError("File is not exist");
        }

        const DeleteExistPrintJob = await db.query("DELETE FROM printingjob WHERE fileid = $1 AND status = 'created'", [fileid]);
        const newPrintjob = await db.query(
            "INSERT INTO printingjob (printerid, userid, fileid, papersize, numpage, numside, numcopy, \
            pagepersheet, colortype, orientation, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [printerid, userid, fileid, papersize, numpage, numside, numcopy, pagepersheet, colortype, orientation, status]
        );

        return newPrintjob.rows[0];
    }

    static async CalculatePrice({
        papersize,
        colortype,
        numpage,
        numside,
        pagepersheet,
        numcopy
    }: {
        papersize: string;
        colortype: string;
        numpage: number;
        numside: number;
        pagepersheet: number;
        numcopy: number;
    }) {
        let base_coin = 1;
        if (papersize == "A4") base_coin = 2;
        if (papersize == "A3") base_coin = 4;
        if (papersize == "A2") base_coin = 8;
        if (papersize == "A1") base_coin = 16;

        let color_price = 1;
        if (colortype != "Grayscale") color_price = 2;

        return Math.ceil(numpage / (numside * pagepersheet)) * numcopy * base_coin * color_price;
    }

    static async CalculateTotalPage({
        userId,
        paperSize,
        startDate,
        endDate
    }: {
        userId: string;
        paperSize: string;
        startDate: string;
        endDate: string;
    }) {
        let allPrintjob = await PrintJobModel.getPrintJobByUserAndPrinter({
            userId: userId,
            printerId: "none",
            startDate: startDate,
            endDate: endDate
        });

        let total_page = 0;
        for (let i in allPrintjob) {
            let printJob = allPrintjob[i];
            if (printJob.status != "success") continue;
            if (printJob.papersize != paperSize && paperSize != "none") continue;
            total_page += Math.ceil(printJob.numpage / (printJob.numside * printJob.pagepersheet)) * printJob.numcopy;
        }

        return total_page;
    }

    static async CalculateTotalUser({ startDate, endDate }: { startDate: string; endDate: string }) {
        let allPrintjob = await PrintJobModel.getPrintJobByUserAndPrinter({
            userId: "none",
            printerId: "none",
            startDate: startDate,
            endDate: endDate
        });

        let user = new Set();
        for (let i in allPrintjob) user.add(allPrintjob[i].userid);
        return user.size;
    }
}

export default PrintingJobService;
