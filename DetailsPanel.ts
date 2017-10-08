/// <reference path="MMap.ts"/>
/// <reference path="Images.ts"/>

interface Dimensions {
    width: number,
    height: number
}

class DetailsPanel {
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __selectedBlock: Block;
    private __map: MMap;

    public dim: Dimensions;
    public padding: any = {top: 15, bottom: 30, left: 15, right: 15};

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: MMap) {
        this.__canvas = canvas;
        this.__ctx = context;
        this.__map = map;

        var rippedDims = games[this.__map.game].rippedDims;
        var aspect = rippedDims.height / rippedDims.width;
        this.dim = {
            width: 350,
            height: 350 * aspect
        };
    }

    public getPosition(): Point
    {
        return {
            x: (this.__canvas.width) - this.dim.width,
            y: 0
        }
    }

    public setSelected (selectedBlock: Block)
    {
        this.__selectedBlock = selectedBlock;
        this.draw();
    }

    //#region rendering

    public draw(): void
    {
        if (!this.__selectedBlock) return;

        var settings = saveContext(this.__ctx);

        this.__ctx.imageSmoothingEnabled = false;
        var pos = this.getPosition();

        this.__ctx.strokeStyle = "rgb(255, 255, 255)";
        this.__ctx.lineWidth = 2;
        this.__ctx.fillStyle = "rgb(0,0,0)";

        this.__ctx.fillRect(pos.x, pos.y, this.dim.width, this.dim.height);
        this.__ctx.strokeRect(pos.x, pos.y, this.dim.width + 5, this.dim.height);

        // Image
        // var item = Images[this.__selectedBlock.blockType];
        // if (item) {
        //     var aspect = item.height / item.width;
        //     var scale = 50;
        //     this.__ctx.drawImage(item, pos.x, pos.y, scale, scale * aspect);
        // }

        // Area
        var areaImage: HTMLImageElement = Areas[this.__map.game][this.__selectedBlock.getArea()];
        if (areaImage) {
            var rippedDims = games[this.__map.game].rippedDims;

            var normAreaPoint = this.__map.getNormAreaPos(this.__selectedBlock.getArea());
            var sourceX = (this.__selectedBlock.x - normAreaPoint.x) * rippedDims.width;
            var sourceY = (this.__selectedBlock.y - normAreaPoint.y) * rippedDims.height;
            var sourceWidth = rippedDims.width;
            var sourceHeight = rippedDims.height;
            var destX = pos.x;
            var destY = pos.y;
            var destWidth = this.dim.width;
            var destHeight = this.dim.height;

            this.__ctx.drawImage(areaImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        }

        // Details
        var details = ItemDetails[this.__selectedBlock.blockType];
        if (details)
        {
            this.__ctx.font = "20px Segoe UI";
            this.__ctx.fillStyle = "White";
            this.__ctx.textAlign = "center";
            this.__ctx.textBaseline = "top";
            this.__ctx.fillText(details.name, pos.x + this.dim.width / 2, this.dim.height - this.padding.bottom);
        }

        restoreContext(this.__ctx, settings);
    }

    //#endregion
};