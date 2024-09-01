const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { Packer, Document, Paragraph, TextRun } = require("docx");
const nodemailer = require("nodemailer");

const authRoutes = require("./routes/auth");
const moduleRoutes = require("./routes/moduleRoutes");
const programRoutes = require("./routes/programRoutes");

const Module = require("./models/Module"); // Ensure this line is present
const Program = require("./models/Program"); // Ensure this line is present

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/programs", programRoutes);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/send-reminder", async (req, res) => {
  const { email, subject, text } = req.body;

  const mailOptions = {
    from: `Admin ${process.env.EMAIL_USER}`,
    to: email,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.get("/api/reviews/not-started", async (req, res) => {
  try {
    const modules = await Module.find({ status: "Not Started" });
    const programs = await Program.find({ status: "Not Started" });

    res.status(200).json({ modules, programs });
  } catch (error) {
    console.error("Error fetching not started reviews:", error);
    res.status(500).send("Error fetching not started reviews");
  }
});

// File upload configuration
const upload = multer({ dest: "uploads/" });

const exportToExcel = async () => {
  const modules = await Module.find().lean();
  const programs = await Program.find().lean();

  const modulesSheet = xlsx.utils.json_to_sheet(modules);
  const programsSheet = xlsx.utils.json_to_sheet(programs);

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, modulesSheet, "Modules");
  xlsx.utils.book_append_sheet(workbook, programsSheet, "Programs");

  const exportsDir = path.join(__dirname, "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(exportsDir, `academic_year_${timestamp}.xlsx`);
  xlsx.writeFile(workbook, filePath);

  return filePath;
};

app.post(
  "/api/upload",
  upload.fields([{ name: "modules" }, { name: "programs" }]),
  async (req, res) => {
    try {
      const modulesFile = req.files["modules"][0];
      const programsFile = req.files["programs"][0];

      let filePath = null;
      if (
        (await Module.countDocuments()) > 0 ||
        (await Program.countDocuments()) > 0
      ) {
        filePath = await exportToExcel();
        console.log("Current academic year exported to:", filePath);
      }

      const modulesWorkbook = xlsx.readFile(modulesFile.path);
      const programsWorkbook = xlsx.readFile(programsFile.path);

      const modulesSheet =
        modulesWorkbook.Sheets[modulesWorkbook.SheetNames[0]];
      const programsSheet =
        programsWorkbook.Sheets[programsWorkbook.SheetNames[0]];

      const modulesData = xlsx.utils.sheet_to_json(modulesSheet);
      const programsData = xlsx.utils.sheet_to_json(programsSheet);

      await Module.deleteMany({});
      await Program.deleteMany({});

      for (const module of modulesData) {
        await Module.create({
          moduleCode: module["moduleCode"],
          fullName: module["fullName"],
          facultyCode: module["facultyCode"],
          academicYear: "",
          moduleLeader: "",
          studentNumbers: "",
          evaluationOperation: "",
          evaluationApproach: "",
          inclusiveCurriculum: "",
          effectPastChanges: "",
          proposedFutureChanges: "",
          qualityAndImprovementPlans: "",
          otherComments: "",
          author: "",
          date: null,
          status: "Not Started",
          email: module["email"] || "", // Add this line
        });
      }

      for (const program of programsData) {
        await Program.create({
          routeCode: program["routeCode"],
          fullName: program["fullName"],
          facultyCode: program["facultyCode"],
          academicYear: "",
          programLeader: "",
          programTeam: "",
          changesFromLastYear: "",
          studentFeedback: "",
          evaluation: "",
          futurePlanning: "",
          otherComments: "",
          author: "",
          date: null,
          status: "Not Started",
          email: program["email"] || "", // Add this line
        });
      }

      res.status(200).json({
        message: "Academic year created successfully",
        filePath: filePath ? `/api/download/${path.basename(filePath)}` : null,
      });
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).send(`Error processing files: ${error.message}`);
    }
  }
);

// Endpoint to download exported file
app.get("/api/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "exports", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

// Endpoint to export the current academic year
app.get("/api/export/current", async (req, res) => {
  try {
    const filePath = await exportToExcel();
    res
      .status(200)
      .json({ filePath: `/api/download/${path.basename(filePath)}` });
  } catch (error) {
    console.error("Error exporting current academic year:", error);
    res
      .status(500)
      .send(`Error exporting current academic year: ${error.message}`);
  }
});

// Function to generate Word document for reviews
const generateWordDocument = async (type, id) => {
  let data;
  if (type === "module") {
    data = await Module.findById(id).lean();
  } else if (type === "program") {
    data = await Program.findById(id).lean();
  }

  if (!data) {
    throw new Error(`${type} not found`);
  }

  const paragraphs = [
    new Paragraph({
      children: [
        new TextRun({
          text: `Review of ${data.fullName}`,
          bold: true,
          size: 28,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Academic Year: ${data.academicYear || ""}`,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Author: ${data.author || ""}`,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date: ${
            data.date ? new Date(data.date).toLocaleDateString() : ""
          }`,
          size: 24,
        }),
      ],
    }),
  ];

  if (type === "module") {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Module Leader: ${data.moduleLeader || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Student Numbers: ${data.studentNumbers || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Evaluation Operation: ${data.evaluationOperation || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Evaluation Approach: ${data.evaluationApproach || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Inclusive Curriculum: ${data.inclusiveCurriculum || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Effect of Past Changes: ${data.effectPastChanges || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Proposed Future Changes: ${
              data.proposedFutureChanges || ""
            }`,
            size: 24,
          }),
        ],
      })
    );
  } else if (type === "program") {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Program Leader: ${data.programLeader || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Evaluation: ${data.evaluation || ""}`,
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Future Planning: ${data.futurePlanning || ""}`,
            size: 24,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(__dirname, "exports", `${type}_review_${id}.docx`);
  fs.writeFileSync(filePath, buffer);

  return filePath;
};

app.get("/api/export/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  try {
    const filePath = await generateWordDocument(type, id);
    res.download(filePath, `${type}_review_${id}.docx`, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error exporting review:", error);
    res.status(500).send(`Error exporting review: ${error.message}`);
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
