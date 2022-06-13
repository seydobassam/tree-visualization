import { StyleOptions } from "../models/options/style-options";

export class NodeStyleOptions implements StyleOptions {
  public radius?: number = 10;
  public fillCollor?: string = "#fff";
  public onMouseHoverColor?: string = undefined;
  public selectedNodeColor?: string = "#09c372";
  public strokeColor?: string = "#09c372";
  public strokeWidth?: string = "3px";
  public styleClass?: string = undefined;
  public addAnimationNodes?: boolean = false;
}
