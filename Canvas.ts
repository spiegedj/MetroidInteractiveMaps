/// <reference path="Globals.ts"/>
/// <reference path="MMap.ts"/>

class Canvas {
    private __canvas: HTMLCanvasElement;
    private __hiddenCanvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;

    public map: MMap;
    public pixelBoundX: number;
    public pixelBoundY: number;

    constructor() {
        this.initCanvas();
        this.initHiddenCanvas();
    }

    //#region Init

    public initCanvas(): void {
        if (!this.__canvas) {
            this.__canvas = document.getElementById("canvas") as HTMLCanvasElement;
        }

        this.resizeCanvas();
    }

    public initHiddenCanvas(): void {
        this.__hiddenCanvas = document.getElementById("hiddenCanvas") as HTMLCanvasElement;
        this.__ctx = this.__hiddenCanvas.getContext("2d");
        this.__ctx.imageSmoothingEnabled = false;
    }

    //#endregion

    public resizeHiddenCanvas(): void {
        this.pixelBoundX = this.map.boundX * this.map.size;
        this.pixelBoundY = this.map.boundY * this.map.size;

        this.__hiddenCanvas.width = this.pixelBoundX;
        this.__hiddenCanvas.height = this.pixelBoundY;
    }

    public resizeCanvas(): void {
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;
    }

    public getMousePosition(event) {
        var rect = this.__canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    public addEventListener() {
        this.__canvas.addEventListener.apply(this.__canvas, arguments);
    }
}