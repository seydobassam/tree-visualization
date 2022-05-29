import { TreeOptions } from "../models/options/tree-options";
import { LinkStyleOptions } from "../options/link-style-options";
import { NodeStyleOptions } from "../options/node-style-options";
import BinaryTree  from "../models/binary-tree";
import * as d3 from "d3";
import { defaultTreeOptions } from "../options/tree-default-options";
import binaryTreeUtiles from "../utiles/binary-tree-utiles";

let treeOptions: TreeOptions;
let svg: any;
let el: string;
let tree: BinaryTree<number | string>;
let isAnimationEnded: boolean = true;

// FIXME: use single principle to refactor below code 
export default function binaryTreeDrawer() {
  function draw(
    element: string,
    binaryTree: BinaryTree<number | string>,
    options?: Partial<TreeOptions>
  ) {
    el = element;
    tree = binaryTree;
    treeOptions = getOptions(options);
    initSvg();
    let { nodes, links } = getTreeData();
    addOptionToBinaryTree(nodes);
    let binaryTreeEnter = getBinaryTreeEnter(nodes);
    if (treeOptions.drawNodes) drawNodes(binaryTreeEnter, treeOptions.nodeStyleOptions!);
    if (treeOptions.drawConnections) drawConnections(links, treeOptions.linkStyleOptions!);
    if (treeOptions.animation) animateConnections();
    if (treeOptions.drawNodevalue) addTextToNodes(binaryTreeEnter);
    if (treeOptions.nodeStyleOptions.onMouseHoverColor) addMouseHoverToNodes();
    if (treeOptions.zoom) addZoom();
  }

  function animate(pathId: number) {
    if(!isAnimationEnded) return; 
    return  svg
    .select(`#${pathId}`)
    .transition(300)
    .duration(treeOptions.duration)
    .attr("stroke", "#626ee3") 
  }

  function onNodeClick(callback: Function): void {
    if (typeof callback !== "function") {
      return;
    }
    svg.selectAll("#g").on("click", (e: any, d: object) => {
      if (isAnimationEnded) {
        if (treeOptions.nodeStyleOptions.selectedNodeColor) {
            selectNode(e);
          }      
          callback(e, d);
      }
    });
  }

  var selectedNode: string;
  function selectNode(event: any) {
    const newSelectedNode = event.currentTarget;
    if (selectedNode) {
      d3.select(selectedNode)
        .select("circle")
        .style("fill", treeOptions.nodeStyleOptions.fillCollor!);
    }

    if (selectedNode === newSelectedNode) {
      selectedNode = "";
      return;
    }

    d3.select(newSelectedNode)
      .select("circle")
      .style("fill", treeOptions.nodeStyleOptions.selectedNodeColor!);
    selectedNode = newSelectedNode;
  }

  function initSvg(): void {
    svg = d3
      .select(`${el}`)
      .append("svg")
      .attr("width", getTreeWidth())
      .attr("height", treeOptions.height)
      .attr("transform", "translate(" + 0 + "," + 150 + ")")
      .append("g")
      .attr("id", "g-container")
      .attr("transform", "translate(" + 0 + "," + 30 + ")");
  }

  function addZoom(): void {
    const scale: any = d3.zoom().scaleExtent([0.5, 5]).on("zoom", zoom);
    d3.select("svg").call(scale);

    function zoom(e: any) {
      d3.select("svg g").attr("transform", e.transform);
    }
  }

  function getTreeData() {
    let tree = d3.tree().size([getTreeWidth(), treeOptions.height]);
    let bst = getHierarchyBT();
    return {
      nodes: getRemovedEmptyNodes(tree(bst).descendants()),
      links: bst.links(),
    };
  }

  function getHierarchyBT(): d3.HierarchyNode<any> {
    return d3.hierarchy(tree.root, function (node: any) {
      node.children = [];
      if (node.left) {
        if (!node.right) {
          node.children.push({});
        }
        node.children.unshift(node.left);
      }

      if (node.right) {
        if (!node.left) {
          node.children.unshift({});
        }
        node.children.push(node.right);
      }
      return node.children;
    });
  }

  function addOptionToBinaryTree(nodes: d3.HierarchyPointNode<unknown>[]) {
    nodes.forEach((node: any) => {
      node.y = node.depth * treeOptions.sizeBetweenNodes;
      if (treeOptions.autoFitText) {
        const newRadius = (node.data?.value?.toString().length / 2) * 11;
        if (treeOptions.nodeStyleOptions.radius! < newRadius) {
          treeOptions.nodeStyleOptions.radius = newRadius;
        }
      }
      return node;
    });
  }

  function getRemovedEmptyNodes(
    nodes: d3.HierarchyPointNode<unknown>[]
  ): d3.HierarchyPointNode<unknown>[] {
    return nodes.filter((node: any) => {
      return !isEmpty(node.data);
    });
  }

  function getRemovedEmptyLinks(
    links: d3.HierarchyLink<any>[]
  ): d3.HierarchyLink<any>[] {
    return links.filter((link: any) => {
      return link?.target?.id;
    });
  }

  function isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 1;
  }

  function drawNodes(
    binaryTreeEnter: any,
    nodeStyleOptions: NodeStyleOptions
  ): void {
    binaryTreeEnter.append("circle").attr("r", nodeStyleOptions.radius);
    const style = {
      fill: nodeStyleOptions.fillCollor,
      stroke: nodeStyleOptions.strokeColor,
      "stroke-width": nodeStyleOptions.strokeWidth,
    };
    !nodeStyleOptions.styleClass
      ? addCssAttributesToElements(svg.selectAll("circle"), style)
      : addClassToElements("circle", nodeStyleOptions.styleClass);
  }

  function addTextToNodes(binaryTreeEnter: any) {
    binaryTreeEnter
      .append("text")
      .attr("x", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function (node: any) {
        return node.data.value;
      });
  }

  function getBinaryTreeEnter(nodes: d3.HierarchyPointNode<unknown>[]) {
    var binaryTree = addBTNodesId(nodes);
    return binaryTree
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("id", "g")
      .attr("transform", function (node: any) {
        return "translate(" + node.x + "," + node.y + ")";
      });
  }

  function addMouseHoverToNodes() {
    svg
      .selectAll("#g")
      .on("mouseenter", (e: any) => handleMouseEnter(e))
      .on("mouseleave", (e: any) => handleMouseLeave(e));
  }

  function handleMouseEnter(event: any) {
    d3.select(event.target)
      .select("circle")
      .attr("fill", treeOptions.nodeStyleOptions.onMouseHoverColor!);
  }

  function handleMouseLeave(event: any) {
    d3.select(event.target)
      .select("circle")
      .attr("fill", treeOptions.nodeStyleOptions.fillCollor!);
  }

  function addBTNodesId(nodes: d3.HierarchyPointNode<unknown>[]): any {
    return svg.selectAll("circle").data(nodes, function (node: any, i: number) {
      return node.id || (node.id = i);
    });
  }

  function drawConnections(links: any, linkStyleOptions: LinkStyleOptions) {
    var connections = svg
      .selectAll("path.link")
      .data(getRemovedEmptyLinks(links), function (link: any) {
        return link.target.id;
      });

    var connections = connections
      .enter()
      .insert("path", "g")
      .attr("class", "algo-path")
      .attr("id", function (e: any) {
        e.pathId = "path" + e.target.id;
        return e.pathId;
      })
      .attr("fill", "none")
      .attr("d", getLinkGenarator())
      .each(function (this: any, d: any) {
        d.totalLength = this.getTotalLength();
      })

    if (treeOptions.animation) {
      addNewPropToConnects(connections);
    }

    const style = {
      stroke: linkStyleOptions.strokeColor,
      "stroke-width": linkStyleOptions.strokeWidth,
    };

    !linkStyleOptions.styleClass
      ? addCssAttributesToElements(svg.selectAll("path"), style)
      : addClassToElements("path", linkStyleOptions.styleClass);
  }

  function addNewPropToConnects(connections: any) {
    connections
      .attr("stroke-dasharray", (d: any) => d.totalLength + " " + d.totalLength )
      .attr("stroke-dashoffset", (d: any) => d.totalLength);
  }

  function animateConnections(paths: any = getPathes(), pathIndex: number = 0) {
    isAnimationEnded = false;
    if (paths.length <= pathIndex) {
        isAnimationEnded = true;
        return
    };
    const path1 = paths[pathIndex];
    const path2 = paths[pathIndex + 1];

    if (path1) {
      transitionPath(path1.id).on("end");
    }

    if (path2) {
      transitionPath(path2.id).on("end", function () {
        animateConnections(paths, pathIndex + 2);
      });
    }
  }

  function getPathes() {
    return svg.selectAll("path")._groups[0];
  }

  function transitionPath(id: string) {
    return svg
      .select("#" + id)
      .transition()
      .duration(treeOptions.duration)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }

  function getLinkGenarator() {
    return d3
      .linkVertical()
      .x(function (link: any) {
        return link.x;
      })
      .y(function (link: any) {
        return link.y;
      });
  }

  function getTreeWidth(): number {
    return treeOptions.autoExpandTreeSize
      ? binaryTreeUtiles().getBinaryTreeWidth(tree)
      : treeOptions.width;
  }

  function getOptions(treeOptions: Partial<TreeOptions> = {}): TreeOptions {
    let options = { ...defaultTreeOptions, ...treeOptions };
    options.nodeStyleOptions = {
      ...defaultTreeOptions.nodeStyleOptions,
      ...treeOptions.nodeStyleOptions,
    };
    options.linkStyleOptions = {
      ...defaultTreeOptions.linkStyleOptions,
      ...treeOptions.linkStyleOptions,
    };
    return options;
  }

  function addCssAttributesToElements(element: any, styleOptions: any) {
    Object.keys(styleOptions).forEach((attrName) => {
      if (attrName && styleOptions[attrName])
        element.attr(attrName, styleOptions[attrName]);
    });
  }

  function addClassToElements(element: string, className: string) {
    svg.selectAll(element).attr("class", className);
  }

  return { draw: draw, onNodeClick: onNodeClick, animate: animate };
}