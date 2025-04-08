import express, { Request, Response } from "express";
import path from "path";
import { uploadMiddleware } from "./middleware/multerConfig";
import fs from "fs";

const app = express();
const PORT: number = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "../public", "index.html"));
});

interface UploadResponse {
	message: string;
	data: {
		profileImage?: string;
		cv?: string;
	};
}

app.post(
	"/upload",
	uploadMiddleware.fields([
		{ name: "profileImage", maxCount: 1 }, // if you want more files are uploaded then cahnge this maxCount
		{ name: "cv", maxCount: 1 },
	]),
	(req: Request, res: Response): void => {
		try {
			const files = req.files as {
				[fieldname: string]: Express.Multer.File[];
			};

			if (!files || Object.keys(files).length === 0) {
				res.status(400).json({ message: "No files uploaded" });
				return;
			}

			const response: UploadResponse = {
				message: "Files uploaded successfully",
				data: {},
			};

			if (files.profileImage?.length) {
				response.data.profileImage = files.profileImage[0].filename;
			}

			if (files.cv?.length) {
				response.data.cv = files.cv[0].filename;
			}

			res.status(200).json(response);
		} catch (error) {
			const err = error as Error;
			res.status(500).json({ message: "Server error", error: err.message });
		}
	}
);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Visit http://localhost:${PORT} to access the application`);
});
