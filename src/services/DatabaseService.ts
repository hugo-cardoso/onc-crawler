import { PrismaClient } from "@prisma/client";

export class DatabaseService {
  private _db: PrismaClient;

  constructor() {
    this._db = new PrismaClient();
  }

  get db() {
    return this._db;
  }
}