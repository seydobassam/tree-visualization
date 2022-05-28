import { BinaryNode } from "./binary-node";
export default class BinaryTree<T> {
  public root: BinaryNode<T>;

  constructor(value: T) {
    this.root = new BinaryNode<T>(value);
  }

  public addNode(val: T): void {
    var newNode = new BinaryNode(val);
    this.insertNode(newNode);
  }

  private insertNode(newNode: BinaryNode<T>, node = this.root): void {
    if (newNode.value === node.value) return;

    if (newNode.value < node.value) {
      if (node.left == null) {
        node.left = newNode;
      } else {
        this.insertNode(newNode, node.left);
      }
    } else {
      if (node.right == null) {
        node.right = newNode;
      } else {
        this.insertNode(newNode, node.right);
      }
    }
  }
}
