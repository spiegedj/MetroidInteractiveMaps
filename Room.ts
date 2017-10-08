/// <reference path="Globals.ts"/>
/// <reference path="MMap.ts"/>
/// <reference path="Block.ts"/>

class Room {
    //#region fields
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __grid: Block[][];
    private __selectedBlock: Block;

    public map: MMap;
    public area: string;
    public isSelected: boolean = false;
    public id: string;
    public style: RoomStyle;
    //#endregion

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, map: MMap, properties: any) {
        this.__canvas = canvas;
        this.__ctx = context;
        this.map = map;
        this.id = guid();

        this.deserialize(properties);
    }

    //#region Rendering
    public draw (): void {
        var size = this.map.size;
        var ctx = this.__ctx;

        ctx.fillStyle = this.style.getRoomColor();
        ctx.lineWidth = .1 * size;

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
    }

    public secondDraw(): void
    {
        var size = this.map.size;
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                this.__grid[x][y].drawSecondary(size);
                this.__grid[x][y].drawDoors(size);
            }
        }
    }

    //#endregion Rendering

    public getPoints(): Point[]
    {
        var blocks = [];
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                blocks.push({x: Number(x), y: Number(y)});
            }
        }
        return blocks;
    }

    public getBlocks(): Block[]
    {
        var blocks = [];
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                var block = this.__grid[x][y];
                if (block) blocks.push(block);
            }
        }
        return blocks;
    }

    public getTopLeftPoint(): Point 
    {
        var points = this.getPoints();
        var topLeft = { x: Number.MAX_VALUE, y: Number.MAX_VALUE};
        points.forEach(function(point) {
            if (point.x < topLeft.x) {
                topLeft.x = point.x
            }

            if (point.y < topLeft.y) {
                topLeft.y = point.y;
            }
        })
        return topLeft;
    }

    public selectBlock (x: number, y: number): Block
    {
        this.__selectedBlock = this.__grid[x][y];
        var nap = this.map.getNormAreaPos(this.area);
        Output.write("Selected Block (" + x + "," + y + ") " + this.area + " Top-Left (" + nap.x + ", " + nap.y + ")");

        return this.__selectedBlock;
    }

    public deselectBlock(): void
    {
        this.__selectedBlock = null;
    }

    public addNewBlock(x: number, y: number, blockType: any, doors: Map<Direction, DoorType>): void {
        this.__grid[x] = this.__grid[x] || [];
        this.__grid[x][y] = new Block(this.__canvas, this.__ctx, this, x, y, blockType, doors);
    }

    public removeBlock (x: number, y: number): void
    {
        if (this.__selectedBlock && this.__selectedBlock.x === x && this.__selectedBlock.y === y)
        {
            this.deselectBlock();
        }

        delete this.__grid[x][y];
        if (Object.keys(this.__grid[x]).length === 0)
        {
            delete this.__grid[x];
        }
    }

    public getBlockAt(x: number, y: number): Block
    {
        return this.__grid[x][y] || null;
    }

    public hasBlockAt(x: number, y: number): boolean
    {
        if (x < 0 || y < 0) return false;
        if (!this.__grid[x]) return false;
        return !!this.__grid[x][y] || false;
    }

    public canPlaceDoor (direction: Direction): boolean
    {
        if (!this.__selectedBlock) return false;
        //if (this.__selectedBlock.hasDoor(direction)) return false;

        var x = this.__selectedBlock.x;
        var y = this.__selectedBlock.y;
        switch(direction)
        {
            case Direction.Up:
                return !this.hasBlockAt(x, y - 1);
            case Direction.Down:
                return !this.hasBlockAt(x, y + 1);
            case Direction.Left:
                return !this.hasBlockAt(x - 1, y);
            case Direction.Right:
                return !this.hasBlockAt(x + 1, y);
        }
    }

    public addDoor(direction: Direction, doorType: DoorType): void
    {
        if (!this.canPlaceDoor(direction)) return;

        this.__selectedBlock.addDoor(direction, doorType);
    }

    public toggleStyle(): string
    {
        this.style.nextStyle();

        return this.style.styleName;
    }

    //#region Serialization

    public serialize(): any {
        var json: any = {};
        json.grid = [];
        for (var x in this.__grid) {
            for (var y in this.__grid[x]) {
                json.grid.push(this.__grid[x][y].serialize());
            }
        }
        json.styleName = this.style.styleName;
        json.area = this.area;

        if (json.grid.length === 0) { return null; }
        return json;
    }

    public deserialize(json: any): void
    {
        this.__grid = [];
        json.grid.forEach(function (block) {
            // if (json.area === "Chozodia") {
            //     block.x--;
            // }
            //block.x += 50;
            //block.y += 10;

            this.addNewBlock(block.x, block.y, block.typeKey, block.doors);
        }, this);

        this.style = new RoomStyle(json.styleName, this.map.game);
        this.area = json.area;
    }

    //#endregion
};