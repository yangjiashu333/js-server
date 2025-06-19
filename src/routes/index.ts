import { Router } from 'express';

const router = Router();

router.get('/redis-test', async (req, res, next) => {
  try {
    const redisClient = req.app.locals.redis;
    await redisClient.set('test-key-route', 'Hello from the route!');
    const value = await redisClient.get('test-key-route');
    res.send(`Value from Redis (set in route): ${value}`);
  } catch (error) {
    next(error);
  }
});

export default router;
