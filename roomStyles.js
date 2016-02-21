function RoomStyle(styleName) {
    this.styleName = styleName || "Normal";
}

RoomStyle.prototype = {
    roomStyles: {
        Normal: {
            lineColor: 'rgb(255,253,249)',
            roomColor: "rgb(0,4,252)",
        },
        Hidden: {
            lineColor: 'rgb(255,253,249)',
            roomColor: "rgb(16,192,104)"
        },
        Hot: {
            lineColor: 'rgb(255,253,249)',
            roomColor: "rgb(252,0,0)"
        }
    },
    styleName: "",

    getLineColor: function RoomStyle$getLineColor()
    {
        return this.roomStyles[this.styleName].lineColor;
    },

    getRoomColor: function RoomStyle$getRoomColor()
    {
        return this.roomStyles[this.styleName].roomColor;
    },

    nextStyle: function RoomStyle$nextStyle()
    {
        var styleKeys = Object.keys(this.roomStyles);
        for (var i = 0; i < styleKeys.length; i++) {
            if (styleKeys[i] === this.styleName) {
                this.styleName = styleKeys[(i + 1) % styleKeys.length];
                return;
            }
        }
    }
};

