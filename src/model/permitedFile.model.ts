import db from "../dbs/initDatabase";

export interface PermitedFile {
  type: string,
  isenable?: boolean,
}

export default class PermitedFileModel {
  static async findAllPermitedFiles(): Promise<PermitedFile[]> {
    const result = await db.query("SELECT * FROM permitedfile;");
    return result.rows;
  }
  static async  addPermitedFile(permitedFile: PermitedFile): Promise<PermitedFile | null> {
    let result;
    if (permitedFile.isenable) {
      result = await db.query(
        `INSERT INTO permitedfile (type, isenable)
        VALUES ($1, $2)
        RETURNING *;`, [permitedFile.type, permitedFile.isenable]);
    }
    else {
      result = await db.query(
        `INSERT INTO permitedfile (type)
        VALUES ($1)
        RETURNING *;`, [permitedFile.type]);
    }
    return result.rows[0] || null;
  }
  static async updatePermitedFile(type: string, data: Partial<PermitedFile>) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    // Return early if no fields to update
    if (fields.length === 0) {
      throw new Error("No fields provided to update");
    }
    const setClauses = fields.map((field, index) => `${field} = $${index+1}`).join(', ');
    const result = await db.query(`
      UPDATE PERMITEDFILE
      SET ${setClauses}
      WHERE TYPE = $${fields.length+1}
      RETURNING *`, [...values, type]); 
    return result.rows[0] || null;
  }
  static async deletePermitedFile(type: string): Promise<PermitedFile | null> {
    const result = await db.query(`
      DELETE FROM permitedfile
      WHERE TYPE = $1
      RETURNING *;`, [type]);
    return result.rows[0] || null;
  }
}