import { describe, expect, it } from 'vitest'

import { Instructor } from './instructor'

describe('Instructor', () => {
  it('should be able to create a instructor', () => {
    const instructor = Instructor.create({
      name: 'Diego',
    })

    expect(instructor.name).toEqual('Diego')
    expect(instructor.id).toBeDefined()
  })
})
