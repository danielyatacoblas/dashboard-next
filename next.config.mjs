import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ancla el rastreo de archivos a este proyecto: sin esto, Next puede inferir
  // como raiz un directorio superior si encuentra otro lockfile en el sistema.
  outputFileTracingRoot: projectRoot,
};

export default nextConfig;
