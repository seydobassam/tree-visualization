import BinaryTree from "./src/models/binary-tree";
import binaryTreeDrawer from "./src/d3-drawer/binaryTreeDrawer";

let bst: BinaryTree<number> = new BinaryTree<number>(100);
bst.addNode(51);
bst.addNode(150);
bst.addNode(12);
bst.addNode(152);
bst.addNode(2);
bst.addNode(144);
bst.addNode(12);
bst.addNode(61);
bst.addNode(62);
bst.addNode(63);
bst.addNode(234);
bst.addNode(22);
bst.addNode(123);
bst.addNode(122);
bst.addNode(125);
bst.addNode(57);
bst.addNode(233);
bst.addNode(235);
bst.addNode(149);
binaryTreeDrawer().draw("div", bst);
binaryTreeDrawer().onNodeClick((_: any, d: any) => {
  if (d.id !== 0) {
    console.log("onNode is called", d);
  }
});

binaryTreeDrawer()
  .animate("#path" + 6)
  .on("end", () => binaryTreeDrawer().animate("#path" + 13));
