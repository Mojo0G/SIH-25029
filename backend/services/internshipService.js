import Internshipdb from "../models/collections/Internship.js";

export class InternshipService {
  static async getAll() {
    return await Internshipdb.find().lean().exec();
  }
}
