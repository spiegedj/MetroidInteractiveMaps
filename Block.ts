/// <reference path="Images.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="MMap.ts"/>

enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right"
}

enum DoorType {
    Normal = "Normal",
    Missile = "Missile",
    SuperMissile = "SuperMissile",
    PowerBomb = "PowerBomb",
    Hidden = "Hidden",
    Blue = "Blue",
    Yellow = "Yellow"
}

class Block {
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __room: Room;
    private __timeoutHandle: number;
    private doors: Map<Direction, DoorType>;

    public blockType: string;
    public x: number;
    public y: number;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, room: Room, x: number, y: number, blockType: any, doors: Map<Direction, DoorType>) {
        this.__canvas = canvas;
        this.__ctx = context;
        this.__room = room;
        this.x = Number(x);
        this.y = Number(y);
        this.doors = doors || new Map<Direction, DoorType>();

        this.blockType = blockType || BlockTypes.Normal;
    }


    //#region Public Functions

    public hasDoor(direction: Direction): boolean {
        return !!this.doors[direction];
    }

    public addDoor(direction: Direction, doorType: DoorType): void {
        this.doors[direction] = doorType;
    }

    public getArea(): string {
        return this.__room.area;
    }

    //#endregion Public Functions

    //#region Main Drawing

    public draw (size: number): void
    {
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;
        

        if (this.blockType === BlockTypes.TunnelHorizontal)
        {
            this.__drawTunnelHorizontal(size);
            return;
        }

        if (this.blockType === BlockTypes.TunnelVertical) {
            this.__drawTunnelVertical(size);
            return;
        }

        ctx.fillRect(x * size, y * size, size + 1, size + 1);

        clearTimeout(this.__timeoutHandle);
        this.__timeoutHandle = setTimeout(function() {
            var areaImage: HTMLImageElement = Areas[this.__room.map.game][this.getArea()];
            if (areaImage) {
                var rippedDims = games[this.__room.map.game].rippedDims;

                var normAreaPoint = this.__room.map.getNormAreaPos(this.getArea());
                var sourceX = (this.x - normAreaPoint.x) * rippedDims.width;
                var sourceY = (this.y - normAreaPoint.y) * rippedDims.height;
                var sourceWidth = rippedDims.width;
                var sourceHeight = rippedDims.height;
                var destX = x * size;
                var destY = y * size;
                var destWidth = size;
                var destHeight = size;

                this.__ctx.drawImage(areaImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                redraw();
            }
        }.bind(this), 0);


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
    }

    private __drawTunnelHorizontal(size: number): void
    {
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;

        var tunnelTop = y * size + (size / 3);
        var tunnelBottom = y * size + (2 * size / 3);

        // Right Border
        var block = this.__room.map.getBlockAt({ x: x + 1, y: y });
        if (block && (block.blockType !== BlockTypes.TunnelHorizontal)) {
            ctx.moveTo((x + 1) * size, (y * size));
            ctx.lineTo((x + 1) * size, tunnelTop);
            ctx.moveTo((x + 1) * size, tunnelBottom);
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        // Left Border
        var block = this.__room.map.getBlockAt({ x: x - 1, y: y });
        if (block && (block.blockType !== BlockTypes.TunnelHorizontal)) {
            ctx.moveTo((x) * size, (y * size));
            ctx.lineTo((x) * size, tunnelTop);
            ctx.moveTo((x) * size, tunnelBottom);
            ctx.lineTo((x) * size, (y + 1) * size);
        }

        ctx.fillRect(x * size, tunnelTop, size + 1, (size / 3) + 1);

        // Top line
        ctx.moveTo((x) * size, tunnelTop);
        ctx.lineTo((x + 1) * size, tunnelTop);

        // Bottom line
        ctx.moveTo((x) * size, tunnelBottom);
        ctx.lineTo((x + 1) * size, tunnelBottom);
    }

    private __drawTunnelVertical(size: number): void 
    {
        var x = this.x;
        var y = this.y;
        var ctx = this.__ctx;

        var tunnelLeft = x * size + (size / 3);
        var tunnelRight = x * size + (2 * size / 3);

        // Bottom Border
        var block = this.__room.map.getBlockAt({ x: x, y: y + 1 });
        if (block && (block.blockType !== BlockTypes.TunnelVertical)) {
            ctx.moveTo((x) * size, (y + 1) * size);
            ctx.lineTo(tunnelLeft, (y + 1) * size);
            ctx.moveTo(tunnelRight, (y + 1) * size);
            ctx.lineTo((x + 1) * size, (y + 1) * size);
        }

        // Top Border
        var block = this.__room.map.getBlockAt({ x: x, y: y - 1 });
        if (block && (block.blockType !== BlockTypes.TunnelVertical)) {
            ctx.moveTo((x) * size, (y) * size);
            ctx.lineTo(tunnelLeft, (y) * size);
            ctx.moveTo(tunnelRight, (y) * size);
            ctx.lineTo((x + 1) * size, (y) * size);
        }

        ctx.fillRect(tunnelLeft, y * size - 1, (size / 3) + 1, size + 2);

        // Left line
        ctx.moveTo(tunnelLeft, y*size);
        ctx.lineTo(tunnelLeft, (y+1) * size);

        // Right line
        ctx.moveTo(tunnelRight, y * size);
        ctx.lineTo(tunnelRight, (y + 1) * size);
    }

    //#endregion

    //#region Door Drawing

    public drawDoors(size: number): void
    {
        var settings = saveContext(this.__ctx);
        
        for (let key in this.doors) {
            let direction = key as any;
            switch (this.doors[direction])
            {
                case DoorType.Hidden:
                    this.__hiddenDoor(size, direction);
                    break;
                case DoorType.Missile:
                    var doorColor = "rgb(249,17,63)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorType.SuperMissile:
                    var doorColor = "rgb(94,251,99)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorType.PowerBomb:
                    var doorColor = "rgb(246,255,0)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorType.Blue:
                    var doorColor = "rgb(2,1,234)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorType.Yellow:
                    var doorColor = "rgb(255,253,67)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
                case DoorType.Normal:
                default:
                    var doorColor = "rgb(0,107,249)";
                    this.__normalDoor(size, direction, doorColor);
                    break;
            }
        }

        restoreContext(this.__ctx, settings);
    }

    private __normalDoor(size: number, direction: Direction, doorColor: string): void
    {
        var ctx = this.__ctx;
        var x = this.x;
        var y = this.y;
        var dW = size / 5;

        if (direction === Direction.Up)
        {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + (2 / 8)) * size, (y) * size - (dW / 2), (1 / 8) * size, dW);
            ctx.fillRect((x + (5 / 8)) * size, (y) * size - (dW / 2), (1 / 8) * size, dW);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + (3 / 8)) * size, (y) * size - (dW / 2), (2 / 8) * size, dW);
        }

        if (direction === Direction.Down) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + (2 / 8)) * size, (y + 1) * size - (dW / 2), (1 / 8) * size, dW);
            ctx.fillRect((x + (5 / 8)) * size, (y + 1) * size - (dW / 2), (1 / 8) * size, dW);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + (3 / 8)) * size, (y + 1) * size - (dW / 2), (2 / 8) * size, dW);
        }

        if (direction === Direction.Left) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x) * size - (dW / 2), (y + (2 / 8)) * size, dW, (1 / 8) * size);
            ctx.fillRect((x) * size - (dW / 2), (y + (5 / 8)) * size, dW, (1 / 8) * size);

            ctx.fillStyle = doorColor;
            ctx.fillRect(x * size - (dW / 2), (y + (3 / 8)) * size, dW, (2 / 8) * size);
        }

        if (direction === Direction.Right) {
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect((x + 1) * size - (dW / 2), (y + (2 / 8)) * size, dW, (1 / 8) * size);
            ctx.fillRect((x + 1) * size - (dW / 2), (y + (5 / 8)) * size, dW, (1 / 8) * size);

            ctx.fillStyle = doorColor;
            ctx.fillRect((x + 1) * size - (dW / 2), (y + (3 / 8)) * size, dW, (2 / 8) * size);
        }
    }

    private __hiddenDoor(size: number, direction: Direction): void
    {
        var ctx = this.__ctx;
        var x = this.x;
        var y = this.y;
        var len = ctx.lineWidth + 2;

        ctx.fillStyle = this.__room.style.getRoomColor();
        if (direction === Direction.Up) {
            ctx.fillRect((x + (1 / 3)) * size, (y) * size - (len / 2), (1 / 3) * size, len);
        }

        if (direction === Direction.Down) {
            ctx.fillRect((x + (1 / 3)) * size, (y + 1) * size - (len / 2), (1 / 3) * size, len);
        }

        if (direction === Direction.Left) {
            ctx.fillRect(x * size - (len / 2), (y + (1 / 3)) * size, len, (1 / 3) * size);
        }

        if (direction === Direction.Right) {
            ctx.fillRect((x + 1) * size - (len / 2), (y + (1 / 3)) * size, len, (1 / 3) * size);
        }
    }

    //#endregion

    //#region Secondary Drawing

    public drawSecondary(size: number): void
    {
        var settings = saveContext(this.__ctx);

        var image = Images[this.blockType];

        if (image) {
            if (image._outlined) {
                this.drawOutline(size);
            }

            this.drawItem(size, image, size * image._scale);
        }
        restoreContext(this.__ctx, settings);
    }

    public drawOutline(size: number): void
    {
        var ctx = this.__ctx;

        this.__ctx.strokeStyle = 'red';
        this.__ctx.strokeRect(this.x * size, this.y * size, size, size);

        var x = this.x * size + 8;
        var y = (this.y + 1) * size - 5;
    }

    //drawSave: function Block$drawSave(size)
    //{
    //    var ctx = this.__ctx;

    //    this.__ctx.strokeStyle = 'red';
    //    this.__ctx.strokeRect(this.x * size, this.y * size, size, size);

    //    var x = this.x * size + 8;
    //    var y = (this.y + 1) * size - 5;

    //    //this.__ctx.fillStyle = 'rgb(204,207,97)';
    //    //this.__ctx.font = 'bold ' + (size) + 'pt Tw Cen MT';
    //    //this.__ctx.fillText('S', x, y);
    //},

    //drawMap: function Block$drawMap(size) {
    //    var ctx = this.__ctx;

    //    this.__ctx.strokeStyle = 'red';
    //    this.__ctx.strokeRect(this.x * size, this.y * size, size, size);

    //    var x = this.x * size + 2;
    //    var y = (this.y + 1) * size - 5;
    //},

    public drawItem(size: number, item: HTMLImageElement, scale: number): void
    {
        scale = scale || (.03 * size);
        var width = item.width * scale;
        var height = item.height * scale;

        var x = this.x * size + (size / 2) - (width / 2);
        var y = (this.y + 1) * size - (size / 2) - (height / 2);

        var aspect = 15 / width;

        this.__ctx.drawImage(item, x, y, width, height);
    }

    //#endregion

    //#region Serialization

    public serialize(): any
    {
        return {
            x: this.x,
            y: this.y,
            doors: Object.keys(this.doors).length > 0 ? this.doors : undefined,
            typeKey: this.blockType
        };
    }

    public deserialize()
    {
    }

    //#endregion
};