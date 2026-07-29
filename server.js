import express from "express";
import cors from "cors";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const uploadDir = path.join(__dirname, ".tmp");
await fs.mkdir(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 20 * 1024 * 1024 },
});

function buildSvgPlaceholder(fileName = "eps-preview") {
  const safeName = String(fileName || "eps-preview").replace(/[<>&"']/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#16110e" />
      <rect x="80" y="80" width="1040" height="640" rx="34" fill="#221613" stroke="#7a5b3d" stroke-width="6" />
      <circle cx="330" cy="430" r="120" fill="none" stroke="#ffbf6a" stroke-width="16" />
      <path d="M250 520 L420 280 L590 520 L730 360 L940 520" stroke="#ffbf6a" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="110" y="140" width="420" height="62" rx="12" fill="#2d1d13" />
      <text x="132" y="182" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="#f8e7d3">EPS preview prepared by backend</text>
      <text x="132" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#d9c0a6">${safeName}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function toDataUrl(mimeType, buffer) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "ignore" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}

async function tryConvertEps(inputPath, outputPath) {
  const candidates = [
    {
      command: "magick",
      args: [
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "magick.exe",
      args: [
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "convert",
      args: [
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "convert.exe",
      args: [
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "gm",
      args: [
        "convert",
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "gm.exe",
      args: [
        "convert",
        inputPath,
        "-background",
        "white",
        "-flatten",
        "-resize",
        "1600x1600",
        `png:${outputPath}`,
      ],
    },
    {
      command: "gs",
      args: [
        "-dSAFER",
        "-dBATCH",
        "-dNOPAUSE",
        "-sDEVICE=pngalpha",
        "-r144",
        `-sOutputFile=${outputPath}`,
        inputPath,
      ],
    },
    {
      command: "gswin64c",
      args: [
        "-dSAFER",
        "-dBATCH",
        "-dNOPAUSE",
        "-sDEVICE=pngalpha",
        "-r144",
        `-sOutputFile=${outputPath}`,
        inputPath,
      ],
    },
  ];

  for (const candidate of candidates) {
    try {
      await runCommand(candidate.command, candidate.args);
      return true;
    } catch {
      // try the next converter
    }
  }

  return false;
}

async function cleanupFiles(paths) {
  await Promise.all(paths.map((entry) => fs.rm(entry, { force: true })));
}

app.post("/api/eps/preview", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const outputDir = path.join(__dirname, ".tmp");
    const outputPath = path.join(outputDir, `${randomUUID()}.png`);

    try {
      const converted = await tryConvertEps(inputPath, outputPath);
      if (converted) {
        const buffer = await fs.readFile(outputPath);
        return res.json({
          previewUrl: toDataUrl("image/png", buffer),
          mimeType: "image/png",
        });
      }

      return res.json({
        previewUrl: buildSvgPlaceholder(req.file.originalname),
        mimeType: "image/svg+xml",
      });
    } finally {
      await cleanupFiles([inputPath, outputPath]);
    }
  } catch (error) {
    console.error("eps preview error", error);
    return res.status(500).json({ error: "EPS preview failed" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`EPS preview server listening on http://localhost:${PORT}`);
});
