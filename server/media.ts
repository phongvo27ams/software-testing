import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './db';

type MediaRecord = {
  id: string;
  originalName: string;
  type: 'image' | 'audio';
  mimeType: string;
  provider: 'local' | 'imagekit';
  providerFileId: string | null;
  url: string;
  localPath: string | null;
};

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');
const mediaDir = path.join(publicDir, 'media');
const imagesDir = path.join(mediaDir, 'images');
const audioDir = path.join(mediaDir, 'audio');
const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/wav', 'audio/ogg']);

const useImageKit = Boolean(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT);

async function ensureLocalFolders() {
  await Promise.all([fs.mkdir(imagesDir, { recursive: true }), fs.mkdir(audioDir, { recursive: true })]);
}

function buildContentUrl(id: string) {
  return `/api/media/${id}/content`;
}

function getLocalDestination(type: 'image' | 'audio') {
  return type === 'audio' ? audioDir : imagesDir;
}

function getExtension(originalName: string) {
  return path.extname(originalName).toLowerCase();
}

function getMediaType(mimeType: string): 'image' | 'audio' {
  return mimeType.startsWith('audio/') ? 'audio' : 'image';
}

async function uploadToImageKit(file: Express.Multer.File, originalName: string, type: 'image' | 'audio') {
  const formData = new FormData();
  formData.append('file', new Blob([file.buffer], { type: file.mimetype }), originalName);
  formData.append('fileName', originalName);
  formData.append('folder', type === 'audio' ? '/quiz/audio' : '/quiz/images');

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`ImageKit upload failed: ${response.status}`);
  }

  return (await response.json()) as { fileId: string; url: string };
}

async function imageKitFileExists(url: string) {
  const response = await fetch(url, { method: 'HEAD' });
  return response.ok;
}

async function persistLocalFile(file: Express.Multer.File, originalName: string, type: 'image' | 'audio') {
  await ensureLocalFolders();
  const destination = getLocalDestination(type);
  const fileName = `${randomUUID()}${getExtension(originalName)}`;
  const filePath = path.join(destination, fileName);
  await fs.writeFile(filePath, file.buffer);
  return { fileName, filePath };
}

async function mediaToResponse(media: MediaRecord) {
  return {
    id: media.id,
    name: media.originalName,
    url: buildContentUrl(media.id),
    type: media.type,
    mimeType: media.mimeType,
    provider: media.provider,
  };
}

export function createMediaRouter() {
  const router = express.Router();
  const upload = multer({
    storage: useImageKit ? multer.memoryStorage() : multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        cb(new Error('Unsupported file type.'));
        return;
      }
      cb(null, true);
    },
  });

  router.get('/', async (_req, res) => {
    const items = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(await Promise.all(items.map(mediaToResponse)));
  });

  router.get('/:id/content', async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) return res.status(404).json({ message: 'Not found' });

    if (useImageKit && media.provider === 'imagekit') {
      if (media.url && (await imageKitFileExists(media.url))) {
        return res.redirect(media.url);
      }
      if (media.localPath) {
        return res.sendFile(path.resolve(rootDir, media.localPath));
      }
      return res.status(404).json({ message: 'Media unavailable.' });
    }

    if (media.localPath) {
      return res.sendFile(path.resolve(rootDir, media.localPath));
    }

    if (media.provider === 'imagekit' && media.url) {
      return res.redirect(media.url);
    }

    return res.status(404).json({ message: 'Media unavailable.' });
  });

  router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const type = getMediaType(req.file.mimetype);
    const mediaId = randomUUID();
    const mediaName = `${randomUUID()}${getExtension(req.file.originalname)}`;

    if (useImageKit) {
      const uploaded = await uploadToImageKit(req.file, mediaName, type);
      const { filePath } = await persistLocalFile(req.file, mediaName, type);
      const relativeLocalPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
      const created = await prisma.media.create({
        data: {
          id: mediaId,
          originalName: mediaName,
          type,
          mimeType: req.file.mimetype,
          provider: 'imagekit',
          providerFileId: uploaded.fileId,
          url: uploaded.url,
          localPath: relativeLocalPath,
        },
      });
      return res.status(201).json(await mediaToResponse(created));
    }

    const { filePath } = await persistLocalFile(req.file, mediaName, type);
    const relativeLocalPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const created = await prisma.media.create({
      data: {
        id: mediaId,
        originalName: mediaName,
        type,
        mimeType: req.file.mimetype,
        provider: 'local',
        providerFileId: null,
        url: buildContentUrl(mediaId),
        localPath: relativeLocalPath,
      },
    });

    res.status(201).json(await mediaToResponse(created));
  });

  router.post('/:id/sync-local', async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) return res.status(404).json({ message: 'Not found' });
    if (media.provider !== 'imagekit') {
      return res.status(400).json({ message: 'Only ImageKit media can be synced.' });
    }

    await ensureLocalFolders();
    const destination = path.join(getLocalDestination(media.type), `${randomUUID()}${path.extname(media.originalName).toLowerCase()}`);
    const response = await fetch(media.url);
    if (!response.ok || !response.body) {
      return res.status(502).json({ message: 'Failed to download remote media.' });
    }
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(destination, Buffer.from(arrayBuffer));

    const updated = await prisma.media.update({
      where: { id: media.id },
      data: {
        provider: 'local',
        providerFileId: null,
        localPath: path.relative(rootDir, destination).replace(/\\/g, '/'),
      },
    });

    return res.json(await mediaToResponse(updated));
  });

  router.delete('/:id', async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (!media) return res.status(404).json({ message: 'Not found' });

    if (media.provider === 'local' && media.localPath) {
      try {
        await fs.unlink(path.resolve(rootDir, media.localPath));
      } catch {
        // ignore missing file
      }
    }

    if (media.provider === 'imagekit' && media.providerFileId) {
      const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(media.providerFileId)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
        },
      });
      if (!response.ok && response.status !== 204) {
        return res.status(response.status).json({ message: 'ImageKit delete failed.' });
      }
    }

    await prisma.media.delete({ where: { id: media.id } });
    return res.status(204).send();
  });

  return router;
}
