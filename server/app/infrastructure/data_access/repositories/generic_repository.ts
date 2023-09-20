import { injectable, unmanaged } from 'inversify';
import { Document, Model } from 'mongoose';
import { Repository } from '../../../domain/interfaces/repository.interface';

@injectable()
export abstract class GenericRepository<TModel extends Document>
  implements Repository<TModel>
{
  private model: Model<TModel>;

  constructor(@unmanaged() schema: Model<TModel>) {
    this.model = schema;
  }

  save(doc: TModel): Promise<TModel> {
    throw new Error('Method not implemented.');
  }

  public async create(item: TModel): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.create(item, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  public async findAll() {
    return new Promise<TModel[]>((resolve, reject) => {
      this.model.find({}, (err, data: TModel[]) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  findById(id: string): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.findById(id, (err: Error, data: TModel) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  // https://masteringjs.io/tutorials/mongoose/update
  updateById(id: string, item: {}): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.findByIdAndUpdate(
        id,
        item,
        { new: true },
        (err: any, data: TModel) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        },
      );
    });
  }

  deleteById(id: string): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.findByIdAndDelete(id, (err: any, data: TModel) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  public findManyById(ids: string[]): Promise<TModel[]> {
    return new Promise<TModel[]>((resolve, reject) => {
      const query = { _id: { $in: ids } };
      this.model.find(query as any, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  public findManyByQuery(query: any) {
    return new Promise<TModel[]>((resolve, reject) => {
      this.model.find(query as any, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
}
