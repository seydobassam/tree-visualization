import BinaryTree from '../models/binary-tree';
import { BinaryNode } from "../models/binary-node";
export default function binaryTreeUtiles() {
  var currentRoot: BinaryNode<String | number>;

  function getBinaryTreeWidth(binaryTree: BinaryTree<String | number>): number {
    currentRoot = binaryTree.root;
    return Math.max(getWidthRequired(), window.innerWidth);
  }

  function getWidthRequired(): number {
    // 50 is the Required space between nodes
    return getMaxLeafNodesFromHeight() * 50;
  }

  function getMaxLeafNodesFromHeight(): number {
    // Math formel to find max leaf nodes from tree height
    return 2 ** (getTreeHeight(currentRoot) - 1);
  } 

  function getTreeHeight(root: BinaryNode<String | number>): number {
    if (root == null) return 0;
    return Math.max(getTreeHeight(root.left!), getTreeHeight(root.right!)) + 1;
  }

  return { getBinaryTreeWidth };
}
