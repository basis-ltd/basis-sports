import 'reflect-metadata';

export const AUDITABLE_METADATA_KEY = 'auditable';

export function Auditable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(AUDITABLE_METADATA_KEY, true, target);
  };
}

export function isAuditableEntity(entity: object): boolean {
  return Reflect.getMetadata(AUDITABLE_METADATA_KEY, entity.constructor) === true;
}