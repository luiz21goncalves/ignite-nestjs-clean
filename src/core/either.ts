// Error
export class Left<TLeft, TRight> {
  public readonly value: TLeft

  constructor(value: TLeft) {
    this.value = value
  }

  isLeft(): this is Left<TLeft, TRight> {
    return true
  }

  isRight(): this is Right<TLeft, TRight> {
    return false
  }
}

// Success
export class Right<TLeft, TRight> {
  public readonly value: TRight

  constructor(value: TRight) {
    this.value = value
  }

  isLeft(): this is Left<TLeft, TRight> {
    return false
  }

  isRight(): this is Right<TLeft, TRight> {
    return true
  }
}

export type Either<TLeft, TRight> = Left<TLeft, TRight> | Right<TLeft, TRight>

export const left = <TLeft, TRight>(value: TLeft): Either<TLeft, TRight> => {
  return new Left(value)
}

export const right = <TLeft, TRight>(value: TRight): Either<TLeft, TRight> => {
  return new Right(value)
}
