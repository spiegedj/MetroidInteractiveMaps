/// <reference path="MMap.ts"/>

class Elevator {
    //#region fields
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __map: MMap;

    public points: Point[];
    //#endregion

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: MMap, properties: any) {
        this.__canvas = canvas;
        this.__ctx = context;
        this.__map = map;

        this.deserialize(properties);
    }

    //#region Rendering
    public draw(size: number): void
    {
        var settings = saveContext(this.__ctx);

        this.__ctx.strokeStyle = 'rgb(0,255,7)';
        this.__ctx.lineWidth = 7;
        this.__ctx.beginPath();
        if (this.points.length > 1)
        {
            this.__ctx.moveTo((this.points[0].x + .5) * size, (this.points[0].y + .5) * size);

            for (var i = 1; i < this.points.length; i++)
            {
                var x = this.points[i].x - .5;
                var y = this.points[i].y + .5;

                this.__ctx.lineTo((x + 1) * size, (y) * size);

            }
        }
        this.__ctx.stroke();
        restoreContext(this.__ctx, settings);
    }
    //#endregion

    //#region Mutating Functions

    public addPoint (point: Point)
    {
        this.points.push(point);
    }

    //#endregion


    //#region Serialization

    public serialize(): any {
        var json: any = {};
        json.points = this.points;
        return json;
    }

    public deserialize(json: any): void
    {
        this.points = json.points || [];
    }
    //#endregion
};