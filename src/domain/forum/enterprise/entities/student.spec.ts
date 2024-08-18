import { describe, expect, it } from 'vitest'

import { Student } from './student'

describe('Student', () => {
  it('should be able to create a student', () => {
    const student = Student.create({
      name: 'Diego',
    })

    expect(student.name).toEqual('Diego')
    expect(student.id).toBeDefined()
  })
})
