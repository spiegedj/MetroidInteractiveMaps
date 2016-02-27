function Elevator(canvas, context, map, properties) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.__map = map;

    this.deserialize(properties);
    this.draw();
}

Elevator.prototype = {
    //#region fields
    __canvas: null,
    __ctx: null,
    __map: null,

    points: null,
    //#endregion

    //#region Rendering
    draw: function Elevator$draw(size) {
        var settings = saveContext(this.__ctx);

        this.__ctx.strokeStyle = 'white';
        this.__ctx.lineWidth = 5;
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
    },
    //#endregion

    //#region Mutating Functions

    addPoint: function Elevator$addPoint(point)
    {
        this.points.push(point);
    },

    //#endregion


    //#region Serialization

    serialize: function Elevator$serialize() {
        var json = {};
        json.points = this.points;
        return json;
    },

    deserialize: function Elevator$deserialize(json) {
        this.points = json.points || [];
    },

    //#endregion
};