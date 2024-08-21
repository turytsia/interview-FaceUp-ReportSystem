import { AppDataSource } from "./data-source"
import { Category, Report } from "./entity/Report"
import express, { Request, Response } from 'express';
import multer from 'multer'
import cors from 'cors'
import path = require("path");

interface MulterRequest extends Request {
  file: any;
}

AppDataSource.initialize().then(async () => {

  const app = express();
  app.use(express.json());
  app.use(cors())
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, (file.fieldname + '-' + uniqueSuffix + '-' + file.originalname).replace(' ', ''));
    }
  });

  const upload = multer({ storage: storage });

  // Create the uploads directory if it doesn't exist
  const fs = require('fs');
  const uploadDir = 'uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  app.get('/reports', async (req: Request, res: Response) => {
    try {
      const reportRepository = AppDataSource.getRepository(Report);
      const reports = await reportRepository.find();
      res.status(200).send(reports);
    } catch (error) {
      res.status(500).send('Failed to fetch reports');
    }
  });

  app.post('/reports', upload.single('filePath'), async (req: MulterRequest, res: Response) => {
    const { category, whoNeedsHelp, class: className, details } = req.body;
    const filePath = req.file ? req.file.path : '';

    if (!Object.values(Category).includes(category)) {
      return res.status(400).send('Invalid category');
    }

    const report = new Report();
    report.category = category;
    report.whoNeedsHelp = whoNeedsHelp;
    report.class = className;
    report.details = details;
    report.filePath = filePath;

    const reportRepository = AppDataSource.getRepository(Report);
    await reportRepository.save(report);

    res.status(201).send(report);
  });

  app.get('/reports/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const reportRepository = AppDataSource.getRepository(Report);
      const report = await reportRepository.findOne({ where: { id: parseInt(id) } });
      if (!report) {
        return res.status(404).send('Report not found');
      }
      res.status(200).send(report);
    } catch (error) {
      res.status(500).send('Failed to fetch report');
    }
  });

  app.put('/reports/:id', upload.single('filePath'), async (req: Request, res: Response) => {
    const id = req.params.id;
    const { category, whoNeedsHelp, class: className, details } = req.body;
    const newFilePath = req.file ? req.file.path : undefined; // Get the new file path if provided

    try {
      const reportRepository = AppDataSource.getRepository(Report);
      let report = await reportRepository.findOne({ where: { id: parseInt(id) } });

      if (!report) {
        return res.status(404).send('Report not found');
      }

      // Remove old file if new file is uploaded
      if (newFilePath && report.filePath && newFilePath !== report.filePath) {
        fs.unlink(report.filePath, (err) => {
          if (err) {
            console.error('Failed to delete old file:', err);
          }
        });
      }

      // Update report details
      report.category = category;
      report.whoNeedsHelp = whoNeedsHelp;
      report.class = className;
      report.details = details;

      // Update filePath only if a new file is uploaded
      if (newFilePath) {
        report.filePath = newFilePath;
      }

      await reportRepository.save(report);
      res.status(200).send(report);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to update report');
    }
  });

  app.delete('/reports/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const reportRepository = AppDataSource.getRepository(Report);
      const report = await reportRepository.findOne({ where: { id: parseInt(id) } });
      if (!report) {
        return res.status(404).send('Report not found');
      }

      if (report.filePath) {
        fs.unlink(report.filePath, (err) => {
          if (err) {
            console.error('Failed to delete file:', err);
          }
        });
      }

      await reportRepository.remove(report);
      res.status(204).send(); // No content on successful deletion
    } catch (error) {
      res.status(500).send('Failed to delete report');
    }
  });

  app.listen(8080, () => {
    console.log('Server is running on port 8080');
  });

}).catch(error => console.log(error))
