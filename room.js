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
    __grid: null,

    style: null,
    lineColor: 'rgb(255,253,249)',
    roomColor: "rgb(0,4,252)",
    //#endregion

    //#region Rendering
    draw: function Map$draw() {
        var size = this.__map.size;
        var ctx = this.__ctx;

        ctx.fillStyle = this.style.roomColor;
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.style.lineColor;
        ctx.lineCap = 'square';
        ctx.beginPath();
        for (var x in this.__grid)
        {
            for (var y in this.__grid[x])
            {
                x = Number(x);
                y = Number(y);
                ctx.fillRect(x * size, y * size, size + 1, size + 1);
                this.drawOutline(x, y);
            }
        }
        ctx.stroke();
    },

    drawOutline: function Room$drawOutline(x, y)
    {
        var size = this.__map.size;
        var ctx = this.__ctx;
        var e = ctx.lineWidth / 2;
        e = 0;

        //Top Border
        if (!this.hasBlockAt(x, y - 1)) {
            ctx.moveTo((x) * size, (y) * size);
            ctx.lineTo((x + 1) * size, (y) * size);
        }

        // Right Border
        if (!this.hasBlockAt(x + 1, y))
        {
            ctx.moveTo((x + 1) * size, (y * size));
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        //Bottom Border
        if (!this.hasBlockAt(x, y + 1)) {
            ctx.moveTo((x) * size, (y + 1) * size);
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        // Left Border
        if (!this.hasBlockAt(x - 1, y)) {
            ctx.moveTo((x) * size, (y * size));
            ctx.lineTo((x) * size, (y + 1) * size);
        }
    },
    //#endregion Rendering

    addNewBlock: function Room$addNewBlock(x, y) {
        this.__grid[x] = this.__grid[x] || {};
        this.__grid[x][y] = true;
    },

    removeBlock: function Room$removeBlock(x, y) {
        delete this.__grid[x][y];
        if (Object.keys(this.__grid[x]).length === 0)
        {
            delete this.__grid[x];
        }
    },

    hasBlockAt: function Room$hasBlockAt(x, y)
    {
        if (x < 0 || y < 0) return false;
        if (!this.__grid[x]) return false;
        return !!this.__grid[x][y] || false;
    },

    toggleStyle: function Room$toggleStyle()
    {
        for (var i = 0; i < roomStyles.length; i++)
        {
            if (this.style.name === roomStyles[i].name) break;
        }

        this.style = roomStyles[(i + 1) % roomStyles.length];
    },

    //#region Serialization

    serialize: function Map$serialize() {
        var json = {};
        json.grid = [];
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                json.grid.push({x: x, y: y});
            }
        }
        //json.style = this.style;

        if (json.grid.length == 0) { return null; }
        return json;
    },

    deserialize: function Map$deserialize(json) {
        this.__grid = {};
        json.grid.forEach(function (block) {
            this.addNewBlock(block.x, block.y);
        }, this);

        this.style = json.style || roomStyles[0];
    },

    //#endregion
};