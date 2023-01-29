import { Container, DisplayObject } from "pixi.js";

export class DraggableObject extends Container {
  private dragging = false;
  constructor() {
    super();
    this.interactive = true;
    this.on("mousemove", (e) => {
      if (this.dragging) {
        this.position.set(e.globalX, e.globalY);
      }
    });
    this.on("mouseup", function (e) {
      this.dragging = false;
    });
    this.on("mousedown", (e) => {
      this.dragging = true;
    });
  }
}
