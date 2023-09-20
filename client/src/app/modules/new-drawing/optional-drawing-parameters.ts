export class OptionalDrawingParameters {
  owner: string;
  ownerModel: string;

  privacyLevel: string;
  password: string;

  public constructor(init?: Partial<OptionalDrawingParameters>) {
    Object.assign(this, init);
  }
}
