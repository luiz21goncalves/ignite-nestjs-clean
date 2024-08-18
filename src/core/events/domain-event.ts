import { UniqueEntityID } from '../entities/unique-entity-id'

export type DomainEvent = {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
