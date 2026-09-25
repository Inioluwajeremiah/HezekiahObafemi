import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

export type Condolence = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const KEY = "condolences";

// In production (e.g. Vercel) set Upstash Redis env vars; locally we fall back to a JSON file.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const FILE = path.join(process.cwd(), "data", "condolences.json");

async function readFile(): Promise<Condolence[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function listCondolences(): Promise<Condolence[]> {
  if (redis) return (await redis.lrange<Condolence>(KEY, 0, -1)) ?? [];
  return readFile();
}

export async function addCondolence(name: string, message: string): Promise<Condolence> {
  const entry: Condolence = {
    id: crypto.randomUUID(),
    name,
    message,
    createdAt: new Date().toISOString(),
  };
  if (redis) {
    await redis.lpush(KEY, entry);
  } else {
    const all = await readFile();
    all.unshift(entry);
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2));
  }
  return entry;
}
