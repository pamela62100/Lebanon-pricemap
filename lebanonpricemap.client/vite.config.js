/* eslint-env node */
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import dotenv from "dotenv";

// Load .env file if it exists
dotenv.config();

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ""
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateName = "lebanonpricemap.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

// Check if we're in Docker build - check multiple sources
const isDockerBuild =
  process.env.DOCKER_BUILD === "true" ||
  process.env.npm_lifecycle_event === "build"; // Also check if running build script

// Only try to create certificates if NOT in Docker build
if (!isDockerBuild) {
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
      0 !==
      child_process.spawnSync(
        "dotnet",
        [
          "dev-certs",
          "https",
          "--export-path",
          certFilePath,
          "--format",
          "Pem",
          "--no-password",
        ],
        { stdio: "inherit" },
      ).status
    ) {
      throw new Error("Could not create certificate.");
    }
  }
}

const target = process.env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`
  : process.env.ASPNETCORE_URLS
    ? process.env.ASPNETCORE_URLS.split(";")[0]
    : "https://localhost:7140";

export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "^/weatherforecast": {
        target,
        secure: false,
      },
    },
    port: parseInt(process.env.DEV_SERVER_PORT || "61206"),
    ...(!isDockerBuild &&
    fs.existsSync(keyFilePath) &&
    fs.existsSync(certFilePath)
      ? {
          https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
          },
        }
      : {}),
  },
});
