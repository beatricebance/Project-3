import mongoose from 'mongoose';

export type DbClient = mongoose.Mongoose;

export const getDatabaseClient = async (
	dbUsername: string,
	dbPassword: string,
	dbCluster: string,
) => {
	return new Promise<DbClient>((resolve, reject) => {
		const connectionString = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}.mongodb.net/colorimagedb?retryWrites=true&w=majority`;
		mongoose.connect(connectionString); 
		const db = mongoose.connection;

		db.on('error', (error: Error) => {
			console.log('Error with the database connection: ', error);
			reject(error);
		});

		db.once('open', () => {
			console.log('Database connection was succesful to: ', dbCluster);
			resolve(mongoose);
		});
	});
};
