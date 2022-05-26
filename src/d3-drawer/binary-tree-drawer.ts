import { TreeOptions } from './../models/options/tree-options';
import { LinkStyleOptions } from "../options/link-style-options";
import { NodeStyleOptions } from "../options/node-style-options";
import { BinaryTree } from "../models/binary-tree";
import * as d3 from "d3";
import { defaultTreeOptions } from "../options/tree-default-options";
import binaryTreeUtiles from "../utiles/binary-tree-utiles";

export class BinaryTreeDrawer {
  private svg: any;
  private element: string;
  private binaryTree: BinaryTree<number | string>;
  private treeOptions: TreeOptions = this.getOptions({});

  constructor(element: string, binaryTree: BinaryTree<number | string>) {
    this.binaryTree = binaryTree;
    this.element = element;
  }

  public draw(treeOptions?: Partial<TreeOptions>) {
    this.treeOptions = this.getOptions(treeOptions);
    this.initSvg();
    let { nodes, links } = this.getTreeData();
    nodes = this.addOptionToBinaryTree(nodes);
    let binaryTreeEnter = this.getBinaryTreeEnter(nodes);
    if (this.treeOptions.drawNodes) this.drawNodes(binaryTreeEnter, this.treeOptions.nodeStyleOptions);
    if (this.treeOptions.drawConnections) this.drawConnections(links, this.treeOptions.linkStyleOptions);
    if (this.treeOptions.drawNodevalue) this.addTextToNodes(binaryTreeEnter);
    if (this.treeOptions.nodeStyleOptions.onMouseHoverColor) this.addMouseHoverToNodes();
    if (this.treeOptions.zoom) this.addZoom();
  }

  public onNodeClick(callback?: Function): void {
    if (typeof callback !== "function") {
      return;
    }
    this.svg
    .selectAll("#g")
    .on("click", (_: any, d: any) => callback(d));
  }

  private initSvg(): void {
    this.svg = d3
      .select(`${this.element}`)
      .append("svg")
      .attr("width", this.getTreeWidth())
      .attr("height", this.treeOptions.height)
      .attr("transform", "translate(" + 0 + "," + 150 + ")")
      .append("g")
      .attr("transform", "translate(" + 0 + "," + 30 + ")");
  }

  private addZoom(): void {
    const scale: any = d3.zoom().scaleExtent([0.5, 5]).on("zoom", zoom);
    d3.select("svg").call(scale);

    function zoom(e: any) {
      d3.select("svg g").attr("transform", e.transform);
    }
  }

  private getTreeData() {
    let tree = d3.tree().size([this.getTreeWidth(), this.treeOptions.height]);
    let bst = this.getHierarchyBT();
    return {
      nodes: this.getRemovedEmptyNodes(tree(bst).descendants()),
      links: bst.links(),
    };
  }

  private getHierarchyBT(): d3.HierarchyNode<any> {
    return d3.hierarchy(this.binaryTree.root, function (node: any) {
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

  private addOptionToBinaryTree(
    nodes: d3.HierarchyPointNode<unknown>[]
  ): any[] {
    return nodes.map((node: any) => {
      node.y = node.depth * this.treeOptions.sizeBetweenNodes;
      if (this.treeOptions.autoFitText) {
        const newRadius = (node.data?.value?.toString().length / 2) * 11;
        if (this.treeOptions.nodeStyleOptions.radius! < newRadius) {
          this.treeOptions.nodeStyleOptions.radius = newRadius;
        }
      }
      return node;
    });
  }

  private getRemovedEmptyNodes(
    nodes: d3.HierarchyPointNode<unknown>[]
  ): d3.HierarchyPointNode<unknown>[] {
    return nodes.filter((node: any) => {
      return !this.isEmpty(node.data);
    });
  }

  private getRemovedEmptyLinks(
    links: d3.HierarchyLink<any>[]
  ): d3.HierarchyLink<any>[] {
    return links.filter((link: any) => {
      return link?.target?.id;
    });
  }

  private isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 1;
  }

  private drawNodes(
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
      ? this.addCssAttributesToElements("circle", style)
      : this.addClassToElements("circle", nodeStyleOptions.styleClass);
  }

  private addTextToNodes(binaryTreeEnter: any) {
    binaryTreeEnter
      .append("text")
      .attr("x", 0)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function (node: any) {
        return node.data.value;
      });
  }

  private getBinaryTreeEnter(nodes: d3.HierarchyPointNode<unknown>[]) {
    var binaryTree = this.addBTNodesId(nodes);
    return binaryTree
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("id", "g")
      .attr("transform", function (node: any) {
        return "translate(" + node.x + "," + node.y + ")";
      });
  }

  private addMouseHoverToNodes() {
    this.svg
      .selectAll("#g")
      .on("mouseenter", this.handleMouseEnter)
      .on("mouseleave", (e: any) => this.handleMouseLeave(e));
  }

  private handleMouseEnter() {
    d3.select(this as any)
      .select("circle")
      .attr("fill", this.treeOptions.nodeStyleOptions.onMouseHoverColor!);
  }

  private handleMouseLeave(event: any) {
    d3.select(event.target)
      .select("circle")
      .attr("fill", this.treeOptions.nodeStyleOptions.fillCollor!);
  }

  private addBTNodesId(nodes: d3.HierarchyPointNode<unknown>[]): any {
    return this.svg
      .selectAll("circle")
      .data(nodes, function (node: any, i: number) {
        return node.id || (node.id = i);
      });
  }

  private drawConnections(links: any, linkStyleOptions: LinkStyleOptions) {
    var connections = this.svg
      .selectAll("path.link")
      .data(this.getRemovedEmptyLinks(links), function (link: any) {
        return link.target.id;
      });

    connections
      .enter()
      .insert("path", "g")
      .attr("fill", "none")
      .attr("d", this.getLinkGenarator());
    const style = {
      stroke: linkStyleOptions.strokeColor,
      "stroke-width": linkStyleOptions.strokeWidth,
    };

    !linkStyleOptions.styleClass
      ? this.addCssAttributesToElements("path", style)
      : this.addClassToElements("path", linkStyleOptions.styleClass);
  }

  private getLinkGenarator() {
    return d3
      .linkVertical()
      .x(function (link: any) {
        return link.x;
      })
      .y(function (link: any) {
        return link.y;
      });
  }

  private getTreeWidth(): number {
    return this.treeOptions.autoExpandTreeSize
      ? binaryTreeUtiles().getBinaryTreeWidth(this.binaryTree)
      : this.treeOptions.width;
  }

  private getOptions(treeOptions: Partial<TreeOptions> = {}): TreeOptions {
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

  private addCssAttributesToElements(element: string, nodeOptions: any) {
    const elements = this.svg.selectAll(element);
    Object.keys(nodeOptions).forEach((attrName) => {
      if (attrName && nodeOptions[attrName])
        elements.attr(attrName, nodeOptions[attrName]);
    });
  }

  private addClassToElements(element: string, className: string) {
    this.svg.selectAll(element).attr("class", className);
  }
}

