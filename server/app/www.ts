import 'reflect-metadata';
import { container } from './infrastructure/ioc/ioc_container';
import {
	boostrap,
	normalizePort,
} from './infrastructure/bootstrapping/bootstrap';
import { referenceDataIoCModule } from './inversify.config';

const runApp = async () => {
	const app = await boostrap(
		container,
		normalizePort(process.env.PORT || '3000'),
		process.env.DB_USERNAME || 'dbUser',
		process.env.DB_PASSWORD || 'dbUser',
		process.env.DB_CLUSTER || 'localhost',
		referenceDataIoCModule,
	);
	return app;
};

(async () => {
	await runApp();
})();
