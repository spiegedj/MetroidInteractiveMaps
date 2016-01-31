function Map(canvas, context, json) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.deserialize(json);

    this.draw();
}

Map.prototype = {
    //#region fields
    __canvas: null,
    __ctx: null,

    boundX: 5000,
    boundY: 5000,
    size: 50,
    grid: null,
    roomList: null,
    //#endregion

    //#region Events 

    onClick: function Map$onClick(position)
    {
        this.addNewRoom(position.x, position.y);
    },

    //#endregion Events

    //#region Grid Functions

    mouseToGrid: function Map$mouseToGrid(mousePosition)
    {
        var x = Math.floor(mousePosition.x / this.size);
        var y = Math.floor(mousePosition.y / this.size);
        return { x: x, y: y };
    },

    getRoomAt: function Map$getRoomAt(x, y)
    {
        if (!this.grid[x]) return null;
        
        return this.grid[x][y] || null;
    },

    addNewRoom: function Map$addNewRoom(x, y)
    {
        var roomObj = new Room(this.__canvas, this.__ctx, this, {x: x, y: y});
        this.grid[roomObj.x] = this.grid[roomObj.x] || {};
        this.grid[roomObj.x][roomObj.y] = roomObj;

        this.roomList.push(roomObj)
    },

    //#endregion Grid Functions

    //#region Rendering
    draw: function Map$draw()
    {
        // Background color
        this.__ctx.fillStyle = 'rgb(32,40,32)';
        this.__ctx.fillRect(0, 0, this.boundX, this.boundY);

        // Draw Grid
        this.__ctx.lineWidth = 2;
        this.__ctx.strokeStyle = 'rgb(7,89,15)';
        for (var x = 0; x < this.boundX; x += this.size)
        {
            this.__ctx.beginPath();
            this.__ctx.moveTo(x, 0);
            this.__ctx.lineTo(x, this.boundY);
            this.__ctx.stroke();

        }

        for (var y = 0; y < this.boundY; y += this.size) {
            this.__ctx.beginPath();
            this.__ctx.moveTo(0, y);
            this.__ctx.lineTo(this.boundX, y);
            this.__ctx.stroke();
        }

        this.roomList.forEach(function (room) {
            room.draw();
        }, this);
    },
    //#endregion Rendering

    //#region Serialization

    serialize: function Map$serialize()
    {
        console.log(JSON.stringify(this));
    },

    deserialize: function Map$deserialize(json)
    {
        this.grid = {};
        this.roomList = [];
        json.grid.forEach(function (room) {
            this.addNewRoom(room.x, room.y);
        }, this);
    },

    //#endregion
};