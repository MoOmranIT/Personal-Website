import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ffmpeg = new FFmpeg();

async function transcode() {
  await ffmpeg.load({
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
  });

  const inputs = [
    { name: 'video-testimonial-01.mp4', time: 12.7 },
    { name: 'video-testimonial-02.mp4', time: 14.9 },
    { name: 'video-testimonial-03.mp4', time: 28.1 },
    { name: 'video-testimonial-04.mp4', time: 18.2 },
  ];

  for (const input of inputs) {
    const inputPath = path.join(__dirname, '..', 'public', 'videos', 'testimonials', input.name);
    const outputName = input.name.replace('.mp4', '.webp');
    const outputPath = path.join(__dirname, '..', 'public', 'images', 'video-testimonials', outputName);

    await ffmpeg.writeFile(input.name, await fetchFile(inputPath));

    await ffmpeg.exec([
      '-ss', String(input.time),
      '-i', input.name,
      '-vframes', '1',
      '-q:v', '80',
      outputName,
    ]);

    const data = await ffmpeg.readFile(outputName);
    const buffer = Buffer.from(data);
    await fs.promises.writeFile(outputPath, buffer);

    console.log(`Wrote ${outputPath} (${buffer.length} bytes)`);
  }
}

transcode().catch((err) => {
  console.error(err);
  process.exit(1);
});
