import { describe, expect, it } from 'vitest'

import { UniqueEntityID } from './unique-entity-id'

describe('Unique Entity ID', () => {
  it('should be able to create a unique entity id', () => {
    const uniqueEntityId = new UniqueEntityID()

    expect(uniqueEntityId).toBeInstanceOf(UniqueEntityID)
    expect(uniqueEntityId).toHaveProperty('toString')
    expect(uniqueEntityId).toHaveProperty('toValue')
  })

  it('should be able to set an id on creating a unique entity id', () => {
    const id = '165ba616-60a9-457c-9afc-6ac7f72604ca'
    const uniqueEntityId = new UniqueEntityID(id)

    expect(uniqueEntityId).toBeInstanceOf(UniqueEntityID)
    expect(uniqueEntityId.toString()).toEqual(id)
    expect(uniqueEntityId.toValue()).toEqual(id)
  })
})
