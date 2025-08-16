import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

export const parseExcel = (fieldName) => {
  return [
    upload.single(fieldName),
    (req, res, next) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        req.excelData = data;

        fs.unlinkSync(req.file.path);

        next();
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Error parsing Excel", error: err.message });
      }
    },
  ];
};
