import { LinkStyleOptions } from "../../options/link-style-options";
import { NodeStyleOptions } from "../../options/node-style-options";
export interface TreeOptions {
  width: number;
  height: number;
  transformTreeFromTop: number;
  transformTreeFromLeft: number;
  zoom: boolean;
  sizeBetweenNodes: number;
  autoFitText: boolean;
  drawNodevalue: boolean;
  drawConnections: boolean;
  drawNodes: boolean;
  autoExpandTreeSize: boolean;
  addMouseHoverToNodes: boolean;
  // FIXME: add below props in seprate ds
  animation: boolean;
  duration: number;
  nodeStyleOptions: NodeStyleOptions;
  linkStyleOptions: LinkStyleOptions;
}
