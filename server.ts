import jsonServer from 'json-server';
import { Request, Response } from 'express';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = 3001;

server.use(middlewares);

server.get('/api/policyholders/:code/top', (req: Request, res: Response) => {
  const { code } = req.params;
  const db = router.db; // 獲取數據庫
  const policyholder = db.get('policyholders').find({ code }).value();

  if (policyholder) {
    res.json(policyholder);
  } else {
    res.status(404).send('Not found');
  }
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
