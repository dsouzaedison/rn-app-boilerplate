/**
 * Base method for all the entities
 * T is a DTO
 */
export abstract class Model<T extends Record<string, any>> {
  protected readonly dto: T;

  constructor(dto: T) {
    this.dto = dto;
  }

  // getComplexDto(): U {}

  getDto(): T {
    // Build dto from data if required
    return this.dto;
  }

  log() {
    console.log('DTO: \n', JSON.stringify(this.getDto(), undefined, 4));
  }
}
