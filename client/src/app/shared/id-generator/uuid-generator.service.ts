import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class UuidGeneratorService {
  constructor() {}

  /**
   * @returns a universally unique id
   */
  generateId(): string {
    return uuidv4();
  }
}
