import { Request, Response } from 'express';
import {
	controller,
	httpGet,
	interfaces,
	request,
	response,
} from 'inversify-express-utils';
import passport from 'passport';

@controller('/', passport.authenticate('jwt', { session: false }))
export class HelloWorldController implements interfaces.Controller {
	@httpGet('/')
	public get(@request() req: Request, @response() res: Response) {
		res.send('Hello World');
	}
}
