import { AbstractTranslationEntity } from "@prisma/client";
import { AbstractDto } from "./dto/abstract.dto";

export abstract class AbstractEntity {
  id!: string; // Ensure ID is consistent with the rest of your application
  createdAt!: Date;
  updatedAt!: Date;
  translations?: AbstractTranslationEntity[];

  constructor(data: Partial<AbstractEntity>) {
    Object.assign(this, data);
  }

  async toDto(options?: any): Promise<AbstractDto> {
    // Abstract method to be implemented in derived classes
    throw new Error("Method 'toDto' needs to be implemented in derived classes.");
  }
}
