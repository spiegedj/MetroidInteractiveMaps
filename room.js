function Room(canvas, context, map, properties) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.__map = map;
    this.deserialize(properties);

    this.draw();
}

Room.prototype = {
    //#region fields
    __canvas: null,
    __ctx: null,
    __map: null,

    lineColor: 'rgb(255,253,249)',
    roomColor: "rgb(0,4,252)",
    x: 0,
    y: 0,
    //#endregion

    //#region Rendering
    draw: function Map$draw() {
        var size = this.__map.size;
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;

        ctx.fillStyle = this.roomColor;
        ctx.fillRect(x * size, y * size, size + 1, size + 1);
       
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.lineColor;
        
        var e = ctx.lineWidth / 2;

        //Top Border
        if (!this.__map.getRoomAt(x, y - 1)) {
            ctx.beginPath();
            ctx.moveTo((x) * size - e, (y) * size);
            ctx.lineTo((x + 1) * size + e, (y) * size);
            ctx.stroke();
        }

        // Right Border
        if (!this.__map.getRoomAt(x + 1, y))
        {
            ctx.beginPath();
            ctx.moveTo((x + 1) * size, (y * size) - e);
            ctx.lineTo((x + 1) * size, (y + 1) * size + e);
            ctx.stroke();
        }

        //Bottom Border
        if (!this.__map.getRoomAt(x, y + 1)) {
            ctx.beginPath();
            ctx.moveTo((x) * size - e, (y + 1) * size);
            ctx.lineTo((x + 1) * size + e, (y + 1) * size);
            ctx.stroke();
        }

        // Left Border
        if (!this.__map.getRoomAt(x - 1 , y)) {
            ctx.beginPath();
            ctx.moveTo((x) * size, (y * size) - e);
            ctx.lineTo((x) * size, (y + 1) * size + e);
            ctx.stroke();
        }
    },
    //#endregion Rendering

    //#region Serialization

    serialize: function Map$serialize() {
        console.log(JSON.stringify(this));
    },

    deserialize: function Map$deserialize(json) {
        this.x = json.x;
        this.y = json.y;
    },

    //#endregion
};