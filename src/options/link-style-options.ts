import { StyleOptions } from "../models/options/style-options";

export class LinkStyleOptions implements StyleOptions {
  public strokeColor?: string = "#ccc";
  public strokeWidth?: string = "3px";
  public styleClass?: string = undefined;
  public addAnimationPaths?: boolean = false;
}
