export abstract class HashGenerator {
  abstract hash(play: string): Promise<string>
}
