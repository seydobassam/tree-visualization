export class BinaryNode<T> {
  public value: T;
  public left?: BinaryNode<T>;
  public right?: BinaryNode<T>;

  constructor(value: T) {
    this.value = value;
  }
}
