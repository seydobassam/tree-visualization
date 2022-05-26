import { LinkStyleOptions } from "./link-style-options";
import { NodeStyleOptions } from "./node-style-options";
import { TreeOptions } from "../models/options/tree-options";

export const defaultTreeOptions: TreeOptions = {
  width: window.innerWidth,
  height: window.innerHeight - 200,
  zoom: true,
  autoFitText: true,
  drawNodes: true,
  drawNodevalue: true,
  drawConnections: true,
  sizeBetweenNodes: 180,
  autoExpandTreeSize: false,
  addMouseHoverToNodes: true,
  animation: false,
  duration: 1000,
  nodeStyleOptions: new NodeStyleOptions(),
  linkStyleOptions: new LinkStyleOptions(),
};
