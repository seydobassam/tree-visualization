import { BinaryTree, binaryTreeDrawer } from "./src/index";

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

binaryTreeDrawer().draw("div", bst, {
  linkStyleOptions: {
    addAnimationPaths: true,
  },
  nodeStyleOptions: {
    addAnimationNodes: false,
    strokeColor: "blue"
  },
});

binaryTreeDrawer().selectNode(bst.root);
binaryTreeDrawer().onNodeClick((node: any) => {
  // console.log(node);

  binaryTreeDrawer().animateNode(node?.data?.value, {
    animationClass: "path",
  });

  binaryTreeDrawer().animatePath(node?.data?.value, {
    animationClass: "path",
  });
});
