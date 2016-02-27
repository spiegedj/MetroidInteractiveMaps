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
    size: 35,
    rooms: null,
    elevators: null,
    selectedRoom: null,
    //#endregion

    //#region Grid Functions

    addBlock: function Map$addBlock(position, blockType) {
        this.selectRoom(position);

        if (!this.selectedRoom) {
            this.addNewRoom({ grid: [] });
        }

        this.selectedRoom.addNewBlock(position.x, position.y, blockType);
    },

    addDoor: function Map$addDoor(direction, doorType)
    {
        if (!this.selectedRoom) return;

        this.selectedRoom.addDoor(direction, doorType);
    },

    selectRoom: function Map$selectRoom(position)
    {
        if (this.getRoomAt(position))
        {
            if (this.selectedRoom)
            {
                this.selectedRoom.isSelected = false;
                this.selectedRoom.deselectBlock();
            }
            this.selectedRoom = this.getRoomAt(position);
            this.selectedRoom.isSelected = true;
            this.selectedRoom.selectBlock(position.x, position.y);
        }
    },

    removeBlock: function Map$removeBlock(position)
    {
        var roomWithBlock = this.getRoomAt(position);
        if (roomWithBlock)
        {
            roomWithBlock.removeBlock(position.x, position.y);
            this.selectedRoom = roomWithBlock;
        }
    },

    toggleStyle: function Map$toggleStyle()
    {
        if (!this.selectedRoom) return;

        this.selectedRoom.toggleStyle();
    },

    getRoomAt: function Map$getRoomAt(position)
    {
        for (var i = 0; i < this.rooms.length; i++)
        {
            if (this.rooms[i].hasBlockAt(position.x, position.y)) {
                return this.rooms[i];
            }
        }

        return null;
    },

    getBlockAt: function Map$getBlockAt(position)
    {
        var room = this.getRoomAt(position);
        if (!room) { return null; }

        return room.getBlockAt(position.x, position.y);
    },

    mouseToGrid: function Map$mouseToGrid(mousePosition, translation)
    {
        var x = Math.floor((mousePosition.x - translation.x) / this.size);
        var y = Math.floor((mousePosition.y - translation.y) / this.size);
        return { x: x, y: y };
    },

    addNewRoom: function Map$addNewRoom(room) {
        var roomObj = new Room(this.__canvas, this.__ctx, this, room);
        this.rooms.push(roomObj);

        if (this.selectedRoom) {
            this.selectedRoom.isSelected = false;
            this.selectedRoom.deselectBlock();
        }

        this.selectedRoom = roomObj;
    },

    addElevatorPoint: function Map$addElevatorPoint(point)
    {
        if (this.elevators.length === 0) {
            this.addNewElevator({});
        }

        this.elevators[this.elevators.length - 1].addPoint(point);
    },

    addNewElevator: function Map$addNewElevator(elevator)
    {
        var elevatorObj = new Elevator(this.__canvas, this.__ctx, this, elevator);
        this.elevators.push(elevatorObj);
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
    },
    //#endregion Rendering

    //#region Serialization

    serialize: function Map$serialize()
    {
        var json = {};
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

        console.log(JSON.stringify(json));
    },

    deserialize: function Map$deserialize(json)
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
    },

    //#endregion
};