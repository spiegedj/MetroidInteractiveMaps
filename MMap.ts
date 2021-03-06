/// <reference path="Globals.ts"/>
/// <reference path="Block.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="Elevator.ts"/>

interface Point {
    x: number;
    y: number;
}

class MMap {
    //#region fields
    private __canvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;

    public rooms: Room[];
    public elevators: Elevator[];
    public selectedRoom: Room;

    public banner: any;
    public boundX: number = 5000;
    public boundY: number = 5000;
    public size: number = 35;
    public area: string;
    public backgroundColor: string = 'rgb(32,40,32)';
    public gridLineColor: string = 'rgb(7,89,15)';
    public game: string;
    //#endregion

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, json: any) {
        this.__canvas = canvas;
        this.__ctx = context;

        this.boundX = json.boundX;
        this.boundY = json.boundY;
        this.banner = json.banner;
        this.size = json.size;
        this.game = json.name;

        this.backgroundColor = json.backgroundColor || this.backgroundColor;
        this.gridLineColor = json.gridLineColor || this.gridLineColor;

        this.deserialize(json.map);
    }

    //#region Grid Functions

    public addBlock(position: Point, blockType: any): void 
    {
        this.selectRoom(position);

        if (!this.selectedRoom) {
            this.addNewRoom({ grid: [] });
        }

        this.selectedRoom.addNewBlock(position.x, position.y, blockType, new Map());
    }

    public addDoor(direction: Direction, doorType: DoorType): void
    {
        if (!this.selectedRoom) return;

        this.selectedRoom.addDoor(direction, doorType);
    }

    public selectRoom(position: Point): Block
    {
        var selectedRoom = this.getRoomAt(position);
        if (selectedRoom)
        {
            if (this.selectedRoom)
            {
                this.selectedRoom.isSelected = false;
                this.selectedRoom.deselectBlock();
            }
            this.selectedRoom = selectedRoom;
            this.selectedRoom.isSelected = true;
            var selectedBlock = this.selectedRoom.selectBlock(position.x, position.y);

            return selectedBlock;
        }
    }

    public removeBlock(position: Point)
    {
        var roomWithBlock = this.getRoomAt(position);
        if (roomWithBlock)
        {
            roomWithBlock.removeBlock(position.x, position.y);
            this.selectedRoom = roomWithBlock;
        }
    }

    public toggleStyle(): string
    {
        if (!this.selectedRoom) return;

        return this.selectedRoom.toggleStyle();
    }

    public toggleArea(): string
    {
        if (!this.selectedRoom) return;

        return this.selectedRoom.toggleArea();
    }

    public getRoomAt(position: Point): Room
    {
        for (var i = 0; i < this.rooms.length; i++)
        {
            if (this.rooms[i].hasBlockAt(position.x, position.y)) {
                return this.rooms[i];
            }
        }

        return null;
    }

    public getBlockAt (position: Point): Block
    {
        var room = this.getRoomAt(position);
        if (!room) { return null; }

        return room.getBlockAt(position.x, position.y);
    }

    public mouseToGrid(mousePoint, translation): Point
    {
        var x = Math.floor((mousePoint.x - translation.x) / this.size);
        var y = Math.floor((mousePoint.y - translation.y) / this.size);
        return { x: x, y: y };
    }

    public addNewRoom(roomProps: any): void
    {
        var roomObj = new Room(this.__canvas, this.__ctx, this, roomProps);
        this.rooms.push(roomObj);

        if (this.selectedRoom) {
            this.selectedRoom.isSelected = false;
            this.selectedRoom.deselectBlock();
        }

        this.selectedRoom = roomObj;
    }

    public addElevatorPoint(point: Point): void
    {
        if (this.elevators.length === 0) {
            this.addNewElevator({});
        }

        this.elevators[this.elevators.length - 1].addPoint(point);
    }

    public addNewElevator(elevator: any): void
    {
        var elevatorObj = new Elevator(this.__canvas, this.__ctx, this, elevator);
        this.elevators.push(elevatorObj);
    }

    public getNormAreaPos(area: string): Point 
    {
        var point: Point = {x : Number.MAX_VALUE, y: Number.MAX_VALUE};
        this.rooms.forEach(function (room: Room) {
            if (room.area === area) {
                var topLeft = room.getTopLeftPoint();
                if (topLeft.x < point.x) {
                    point.x = topLeft.x;
                }

                if (topLeft.y < point.y) {
                    point.y = topLeft.y;
                }
            }
        }, this);
        return point;
    }

    public translateArea(area: string, left: number, bottom: number) : void
    {
        this.rooms.forEach(function (room: Room) {
            if (room.area === area) {
                room.translate(left, bottom);
            }
        }, this);
    }

    //#endregion Grid Functions

    //#region Rendering
    public draw (): void
    {
        var pixelBoundX = this.boundX * this.size;
        var pixelBoundY = this.boundY * this.size;

        // Background color
        this.__ctx.fillStyle = this.backgroundColor;
        this.__ctx.fillRect(0, 0, pixelBoundX, pixelBoundY);

        // Draw Grid
        this.__ctx.lineWidth = 2;
        //this.__ctx.setLineDash([7]);
        this.__ctx.strokeStyle = this.gridLineColor;
        for (var x = 0; x < pixelBoundX; x += this.size)
        {
            this.__ctx.beginPath();
            this.__ctx.moveTo(x, 0);
            this.__ctx.lineTo(x, pixelBoundY);
            this.__ctx.stroke();
        }

        for (var y = 0; y < pixelBoundY; y += this.size) {
            this.__ctx.beginPath();
            this.__ctx.moveTo(0, y);
            this.__ctx.lineTo(pixelBoundX, y);
            this.__ctx.stroke();
        }
        this.__ctx.setLineDash([]);


        // Draw Elevators
        this.elevators.forEach(function (elevator) {
            elevator.draw(this.size);
        }, this);


        // Draw Rooms
        this.rooms.forEach(function (room) {
            room.draw();
        }, this);

        this.rooms.forEach(function (room) {
            room.secondDraw();
        }, this);

        // Banner
        this.drawBanner();
    }

    public drawBanner(): void
    {
        if (this.banner) 
        {
            var x = this.banner.x * this.size;
            var y = this.banner.y * this.size;

            var aspect = this.banner.image.height / this.banner.image.width;
            var scale = this.size * this.banner.scale;
            this.__ctx.drawImage(this.banner.image, x, y, scale, scale * aspect);
        }
    }
    //#endregion Rendering

    //#region Serialization

    public serialize(): void
    {
        var json: any = {};
        json.rooms = [];
        this.rooms.forEach(function (room) {
            var jsonRoom = room.serialize();
            if (jsonRoom) {
                json.rooms.push(jsonRoom);
            }
        }, this);

        json.elevators = [];
        this.elevators.forEach(function (elevator) {
            var jsonElevator = elevator.serialize();
            if (jsonElevator) {
                json.elevators.push(jsonElevator);
            }
        }, this);

        console.log("map: " + JSON.stringify(json));
    }

    public deserialize (json: any): void
    {
        this.rooms = [];
        json.rooms.forEach(function (room) {
            this.addNewRoom(room);
        }, this);

        this.elevators = [];
        json.elevators = json.elevators || [];
        json.elevators.forEach(function (elevator) {
            this.addNewElevator(elevator);
        }, this);

        // var conversions = new Conversions(this);
        // conversions.addAreas();
    }

    //#endregion
};