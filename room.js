function Room(canvas, context, map, properties) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.__map = map;
    this.id = guid();

    this.deserialize(properties);

    this.draw();
}

Room.prototype = {
    //#region fields
    __canvas: null,
    __ctx: null,
    __map: null,
    __grid: null,
    __selectedBlock: null,

    isSelected: false,
    id: null,
    style: null,
    //#endregion

    //#region Rendering
    draw: function Room$draw() {
        var size = this.__map.size;
        var ctx = this.__ctx;

        ctx.fillStyle = this.style.getRoomColor();
        ctx.lineWidth = 4;

        if (!this.isSelected) {
            ctx.strokeStyle = this.style.getLineColor();
        } else {
            ctx.strokeStyle = "rgb(255,150,0)"
        }
        ctx.lineCap = 'square';
        ctx.beginPath(); // Primary Draw
        for (var x in this.__grid)
        {
            for (var y in this.__grid[x])
            {
                this.__grid[x][y].draw(size);
            }
        }
        ctx.stroke();

        if (this.__selectedBlock) {
            ctx.rect(this.__selectedBlock.x * size, this.__selectedBlock.y * size, size + 1, size + 1);
            ctx.stroke();
        }
    },

    secondDraw: function Room$secondDraw() {
        var size = this.__map.size;
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                this.__grid[x][y].drawSecondary(size);
                this.__grid[x][y].drawDoors(size);
            }
        }
    },

    //#endregion Rendering

    selectBlock: function Room$selectBlock(x, y)
    {
        this.__selectedBlock = this.__grid[x][y];
        Output.write("Selected Block (" + x + "," + y + ")");
    },

    deselectBlock: function Room$deselectBlock(x, y)
    {
        this.__selectedBlock = null;
    },

    addNewBlock: function Room$addNewBlock(x, y, blockType, doors) {
        this.__grid[x] = this.__grid[x] || {};
        this.__grid[x][y] = new Block(this.__canvas, this.__ctx, this, x, y, blockType, doors);
    },

    removeBlock: function Room$removeBlock(x, y) {
        if (this.__selectedBlock && this.__selectedBlock.x === x && this.__selectedBlock.y === y)
        {
            this.deselectBlock();
        }

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

    canPlaceDoor: function Room$canPlaceDoor(direction)
    {
        if (!this.__selectedBlock) return false;
        //if (this.__selectedBlock.hasDoor(direction)) return false;

        var x = this.__selectedBlock.x;
        var y = this.__selectedBlock.y;
        switch(direction)
        {
            case Enums.Direction.Up:
                return !this.hasBlockAt(x, y - 1);
            case Enums.Direction.Down:
                return !this.hasBlockAt(x, y + 1);
            case Enums.Direction.Left:
                return !this.hasBlockAt(x - 1, y);
            case Enums.Direction.Right:
                return !this.hasBlockAt(x + 1, y);
        }
    },

    addDoor: function Room$addDoor(direction, doorType)
    {
        if (!this.canPlaceDoor(direction)) return;

        this.__selectedBlock.addDoor(direction, doorType);
    },

    toggleStyle: function Room$toggleStyle()
    {
        this.style.nextStyle();
    },

    //#region Serialization

    serialize: function Room$serialize() {
        var json = {};
        json.grid = [];
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                json.grid.push(this.__grid[x][y].serialize());
            }
        }
        json.styleName = this.style.styleName;

        if (json.grid.length === 0) { return null; }
        return json;
    },

    deserialize: function Room$deserialize(json) {
        this.__grid = {};
        json.grid.forEach(function (block) {
            this.addNewBlock(block.x, block.y, block.typeKey, block.doors);
        }, this);

        this.style = new RoomStyle(json.styleName);
    },

    //#endregion
};