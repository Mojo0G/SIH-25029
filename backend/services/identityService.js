import Identitydb from "../models/collections/Identity.js";

export class IdentityService {
  static async getAll() {
    return await Identitydb.find().lean().exec();
  }
}
