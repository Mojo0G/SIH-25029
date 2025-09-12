import Graduationdb from "../models/collections/Graduation.js";

export class GraduationService {
  static async getAll() {
    return await Graduationdb.find().lean().exec();
  }

  static async getById(id) {
    const doc = await Graduationdb.findOne({ id: Number(id) })
      .lean()
      .exec();
    if (!doc) {
      throw new Error("Not found");
    }
    return doc;
  }

  static async create(data) {
    return await Graduationdb.create(data);
  }

  static async updateById(id, data) {
    const updated = await Graduationdb.findOneAndUpdate(
      { id: Number(id) },
      data,
      { new: true }
    );
    if (!updated) {
      throw new Error("Not found");
    }
    return updated;
  }

  static async deleteById(id) {
    const removed = await Graduationdb.findOneAndDelete({ id: Number(id) });
    if (!removed) {
      throw new Error("Not found");
    }
    return { success: true };
  }
}
