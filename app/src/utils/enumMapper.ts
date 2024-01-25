export function mapStringToEnum<T>(input: string, enumObject: T): T[keyof T] | undefined {
  if (!(input.toUpperCase() in (enumObject as unknown as object))) {
    console.log(`"${input}" is not a valid enum key.`)
    return undefined
  }
  return enumObject[input as keyof T]
}
