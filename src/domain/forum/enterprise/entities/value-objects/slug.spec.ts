import { describe, expect, it } from 'vitest'

import { Slug } from './slug'

describe('Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })

  it('should be able to remove special characters on creating a slug', () => {
    const slug = Slug.createFromText('Preocupação desnecessária devido à nada')

    expect(slug.value).toEqual('preocupacao-desnecessaria-devido-a-nada')
  })

  it('should be able to create an instance of Slug receiving a raw content', () => {
    const slug = Slug.create('raw content and not formatted')

    expect(slug.value).toEqual('raw content and not formatted')
  })
})
