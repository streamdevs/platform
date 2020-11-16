import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

export default nc<NextApiRequest, NextApiResponse>().get((req, res) => {
	res.json({ foo: 'bar' });
});
