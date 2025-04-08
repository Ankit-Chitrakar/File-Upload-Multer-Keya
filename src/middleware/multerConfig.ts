import multer from "multer";
import path from "path";
import { Request } from "express";

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

const storage = multer.diskStorage({
	destination: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) {
		cb(null, path.join(__dirname, "../../uploads"));
	},
	filename: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void
	) {
		const uniqueSuffix = Date.now();
		const fileExt = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
	},
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
	if (file.fieldname === "profileImage") {
		if (
			file.mimetype === "image/jpeg" ||
			file.mimetype === "image/png" ||
			file.mimetype === "image/gif"
		) {
			cb(null, true);
		} else {
			cb(
				new Error("Profile image must be JPEG, PNG, or GIF format") as any,
				false
			);
		}
	} else if (file.fieldname === "cv") {
		if (
			file.mimetype === "application/pdf" ||
			file.mimetype === "application/msword" ||
			file.mimetype ===
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			cb(null, true);
		} else {
			cb(new Error("CV must be PDF, DOC, or DOCX format") as any, false);
		}
	} else {
		cb(null, false);
	}
};

export const uploadMiddleware = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // max size is 10 mb
	},
});
