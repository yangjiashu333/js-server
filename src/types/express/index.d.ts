import { Redis } from 'ioredis';

declare global {
  namespace Express {
    interface Locals {
      redis: Redis;
    }
  }
}
