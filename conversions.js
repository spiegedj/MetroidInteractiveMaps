function Conversions(map) {
    this.map = map;
};

Conversions.prototype =
{
    map: null,

    addAreas: function Conversion$addAreas()
    {

        var names = ["Brinstar", "Tourian", "Norfair", "Kraid", "Ridley", "Crateria", "Chozodia"];
        var i = 0;

        this.map.rooms.forEach(function (room) {
            if (!room.area) {
                this.__areaRecurse(room, names[i]);
                i++;
            }
        }, this);
    },

    __areaRecurse: function Conversion$__areaRecurse(currentRoom, name)
    {
        currentRoom.area = name;

        currentRoom.getPositions().forEach(function (p) {
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
    },
};