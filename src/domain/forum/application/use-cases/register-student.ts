import { Either, left, right } from '@/core/either'

import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/students-repository'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'

type RegisterStudentUseCaseRequest = {
  name: string
  email: string
  password: string
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>

export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassoword = await this.hashGenerator.hash(password)

    const student = Student.create({ name, email, password: hashedPassoword })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
