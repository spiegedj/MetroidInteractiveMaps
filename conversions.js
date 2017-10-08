class Conversions {
    constructor(map) {
        this.map = map;
    }
    addAreas() {
        this.map.rooms.forEach(function (room) {
            if (!room.area) {
                var styleName = room.style.styleName;
                if (styleName === "WreckedShip")
                    styleName = "Wrecked Ship";
                room.area = styleName;
                //this.__areaRecurse(room);
            }
        }, this);
    }
    __areaRecurse(currentRoom, name) {
        currentRoom.area = name;
        currentRoom.getPoints().forEach(function (p) {
            var right = this.map.getRoomAt({ x: p.x + 1, y: p.y });
            var left = this.map.getRoomAt({ x: p.x - 1, y: p.y });
            var down = this.map.getRoomAt({ x: p.x, y: p.y + 1 });
            var up = this.map.getRoomAt({ x: p.x, y: p.y - 1 });
            if (up && !up.area) {
                this.__areaRecurse(up, name);
            }
            if (left && !left.area) {
                this.__areaRecurse(left, name);
            }
            if (down && !down.area) {
                this.__areaRecurse(down, name);
            }
            if (right && !right.area) {
                this.__areaRecurse(right, name);
            }
        }, this);
    }
}
;
