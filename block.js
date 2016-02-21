function Block(canvas, context, room, x, y, blockType, doors) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.__room = room;
    this.x = Number(x);
    this.y = Number(y);
    this.doors = doors || {};

    this.__typeKey = blockType || BlockTypes.Normal;
}

BlockTypes = {
    Normal: "Normal",
    Save: "Save",
    Map: "Map",
    Chozo: "Chozo",
    TunnelHorizontal: "TunnelHorizontal",
    Missile: "Missile",
    EnergyTank: "EnergyTank",
    SuperMissile: "SuperMissile",
    PowerBomb: "PowerBomb",
    Bomb: "Bomb",
    ChargeBeam: "ChargeBeam",
    HiJumpBoots: "HiJumpBoots",
    IceBeam: "IceBeam",
    LongBeam: "LongBeam",
    Morphball: "Morphball",
    PowerGrip: "PowerGrip",
    ScrewAttack: "ScrewAttack",
    SpeedBooster: "SpeedBooster",
    UnknownItem1: "UnknownItem1",
    UnknownItem2: "UnknownItem2",
    UnknownItem3: "UnknownItem3",
    Varia: "Varia",
    WaveBeam: "WaveBeam",
    ZipLineActivator: "ZipLineActivator"
};

DoorTypes = {
    Normal: "Normal",
    Missile: "Missile",
    SuperMissile: "SuperMissile",
    PowerBomb: "PowerBomb",
    Hidden: "Hidden",
}

Block.prototype = {
    __canvas: null,
    __ctx: null,
    __typeKey: "",

    doors: null,
    x: 0,
    y: 0,

    //#region Mutating Functions

    hasDoor: function Block$hasDoor(direction) {
        return this.doors[direction];
    },

    addDoor: function Block$addDoor(direction, doorType) {
        this.doors[direction] = doorType;
    },

    //#endregion

    //#region Main Drawing

    draw: function Block$draw(size)
    {
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;
        

        if (this.__typeKey === BlockTypes.TunnelHorizontal)
        {
            this.drawTunnelHorizontal(size);
            return;
        }

        ctx.fillRect(x * size, y * size, size + 1, size + 1);

        //Top Border
        if (!this.__room.hasBlockAt(x, y - 1)) {
            ctx.moveTo((x) * size, (y) * size);
            ctx.lineTo((x + 1) * size, (y) * size);
        }

        // Right Border
        if (!this.__room.hasBlockAt(x + 1, y)) {
            ctx.moveTo((x + 1) * size, (y * size));
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        //Bottom Border
        if (!this.__room.hasBlockAt(x, y + 1)) {
            ctx.moveTo((x) * size, (y + 1) * size);
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        // Left Border
        if (!this.__room.hasBlockAt(x - 1, y)) {
            ctx.moveTo((x) * size, (y * size));
            ctx.lineTo((x) * size, (y + 1) * size);
        }
    },

    drawTunnelHorizontal: function Block$drawTunnelHorizontal(size)
    {
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;

        var tunnelTop = y * size + (size / 3);
        var tunnelBottom = y * size + (2 * size / 3);

        // Right Border
        ctx.moveTo((x + 1) * size, (y * size));
        ctx.lineTo((x + 1) * size, tunnelTop);
        ctx.moveTo((x + 1) * size, tunnelBottom);
        ctx.lineTo((x + 1) * size, (y + 1) * size);

        // Left Border
        ctx.moveTo((x) * size, (y * size));
        ctx.lineTo((x) * size, tunnelTop);
        ctx.moveTo((x) * size, tunnelBottom);
        ctx.lineTo((x) * size, (y + 1) * size);

        ctx.fillRect(x * size, tunnelTop, size + 1, (size / 3) + 1);

        // Top line
        ctx.moveTo((x) * size, tunnelTop);
        ctx.lineTo((x + 1) * size, tunnelTop);

        // Bottom line
        ctx.moveTo((x) * size, tunnelBottom);
        ctx.lineTo((x + 1) * size, tunnelBottom);
    },

    //#endregion

    //#region Door Drawing

    drawDoors: function Block$drawDoors(size)
    {
        var settings = this.saveContext(this.__ctx);
        
        for (direction in this.doors)
        {
            var doorType = this.doors[direction];
            switch (doorType)
            {
                case DoorTypes.Hidden:
                    this.__hiddenDoor(size, direction);
                    break;
                case DoorTypes.Missile:
                    var doorColor = "rgb(249,17,63)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorTypes.SuperMissile:
                    var doorColor = "rgb(0,107,249)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorTypes.PowerBomb:
                    var doorColor = "rgb(0,107,249)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorTypes.Normal:
                default:
                    var doorColor = "rgb(0,107,249)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
            }
        }

        this.restoreContext(this.__ctx, settings);
    },

    __normalDoor: function Block$__normalDoor(size, direction, doorColor)
    {
        var ctx = this.__ctx;
        var x = this.x;
        var y = this.y;

        if (direction === Enums.Direction.Up)
        {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + (2 / 8)) * size, (y) * size - 4, (1 / 8) * size, 8);
            ctx.fillRect((x + (5 / 8)) * size, (y) * size - 4, (1 / 8) * size, 8);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + (3 / 8)) * size, (y) * size-4, (2 / 8) * size, 8);
        }

        if (direction === Enums.Direction.Down) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + (2 / 8)) * size, (y + 1) * size - 4, (1 / 8) * size, 8);
            ctx.fillRect((x + (5 / 8)) * size, (y + 1) * size - 4, (1 / 8) * size, 8);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + (3 / 8)) * size, (y + 1) * size - 4, (2 / 8) * size, 8);
        }

        if (direction === Enums.Direction.Left) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x) * size - 4, (y + (2 / 8)) * size, 8, (1 / 8) * size);
            ctx.fillRect((x) * size - 4, (y + (5 / 8)) * size, 8, (1 / 8) * size);

            ctx.fillStyle = doorColor;
            ctx.fillRect(x * size - 4, (y + (3 / 8)) * size, 8, (2 / 8) * size);
        }

        if (direction === Enums.Direction.Right) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + 1) * size - 4, (y + (2 / 8)) * size, 8, (1 / 8) * size);
            ctx.fillRect((x + 1) * size - 4, (y + (5 / 8)) * size, 8, (1 / 8) * size);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + 1) * size - 4, (y + (3 / 8)) * size, 8, (2 / 8) * size);
        }
    },

    __hiddenDoor: function Block$__hiddenDoor(size, direction)
    {
        var ctx = this.__ctx;
        var x = this.x;
        var y = this.y;
        var len = ctx.lineWidth + .4;

        ctx.fillStyle = this.__room.style.getRoomColor();
        if (direction === Enums.Direction.Up) {
            ctx.fillRect((x + (1 / 3)) * size, (y) * size - (len / 2), (1 / 3) * size, len);
        }

        if (direction === Enums.Direction.Down) {
            ctx.fillRect((x + (1 / 3)) * size, (y + 1) * size - (len / 2), (1 / 3) * size, len);
        }

        if (direction === Enums.Direction.Left) {
            ctx.fillRect(x * size - (len / 2), (y + (1 / 3)) * size, len, (1 / 3) * size);
        }

        if (direction === Enums.Direction.Right) {
            ctx.fillRect((x + 1) * size - (len / 2), (y + (1 / 3)) * size, len, (1 / 3) * size);
        }
    },

    //#endregion

    //#region Secondary Drawing

    saveContext: function Block$saveContext(ctx) 
    {
        return {
            strokeStyle: ctx.strokeStyle,
            fillStyle: ctx.fillStyle,
            lineWidth: ctx.lineWidth,
            font: ctx.font
        }
    },

    restoreContext: function Block$restoreContext(ctx, orig)
    {
        ctx.strokeStyle = orig.strokeStyle;
        ctx.fillStyle = orig.fillStyle;
        ctx.lineWidth = orig.lineWidth;
        ctx.font = orig.font;
    },

    drawSecondary: function Block$drawSecondary(size)
    {
        var original = this.saveContext(this.__ctx);

        switch (this.__typeKey)
        {
            case BlockTypes.Save:
                this.drawSave(size);
                break;
            case BlockTypes.Map:
                this.drawMap(size);
                break;
            case BlockTypes.Chozo:
            case BlockTypes.Missile:
            case BlockTypes.EnergyTank:
            case BlockTypes.SuperMissile:
            case BlockTypes.PowerBomb:
            case BlockTypes.Bomb:
            case BlockTypes.ChargeBeam:
            case BlockTypes.HiJumpBoots:
            case BlockTypes.IceBeam:
            case BlockTypes.LongBeam:
            case BlockTypes.Morphball:
            case BlockTypes.PowerGrip:
            case BlockTypes.ScrewAttack:
            case BlockTypes.SpeedBooster:
            case BlockTypes.UnknownItem1:
            case BlockTypes.UnknownItem2:
            case BlockTypes.UnknownItem3:
            case BlockTypes.Varia:
            case BlockTypes.WaveBeam:
            case BlockTypes.ZipLineActivator:
                this.drawItem(size, Images[this.__typeKey]);
                break;
        }

        this.restoreContext(this.__ctx, original);
    },

    drawSave: function Block$drawSave(size)
    {
        var ctx = this.__ctx;

        ctx.beginPath();
        this.__ctx.strokeStyle = 'red';
        this.draw(size);
        ctx.stroke();

        var x = this.x * size + 8;
        var y = (this.y + 1) * size - 5;

        this.__ctx.fillStyle = 'rgb(204,207,97)';
        this.__ctx.font = 'lighter 45pt Tw Cen MT';
        this.__ctx.fillText('s', x, y);
    },

    drawMap: function Block$drawMap(size) {
        var ctx = this.__ctx;

        ctx.beginPath();
        this.__ctx.strokeStyle = 'red';
        this.draw(size);
        ctx.stroke();

        var x = this.x * size + 2;
        var y = (this.y + 1) * size - 5;

        this.__ctx.fillStyle = 'rgb(204,207,97)';
        this.__ctx.font = 'bold 28pt Tw Cen MT';
        this.__ctx.fillText('M', x, y);
    },

    drawItem: function Block$drawItem(size, item)
    {
        var width = item.width;
        var height = item.height;

        var x = this.x * size + (size / 2) - (width / 2);
        var y = (this.y + 1) * size - (size / 2) - (height / 2);

        this.__ctx.imageSmoothingEnabled = false;
        this.__ctx.drawImage(item, x, y);
    },

    //#endregion

    //#region Serialization

    serialize: function Block$serialize()
    {
        return {
            x: this.x,
            y: this.y,
            doors: Object.keys(this.doors).length > 0 ? this.doors : undefined,
            typeKey: this.__typeKey
        };
    },

    deserialize: function Block$deserialize()
    {
    },

    //#endregion
};