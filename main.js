function $$fcd(instance, method) {
    return function () {
        return method.apply(instance, arguments);
    };
}

function Main() {
    this.__translation = { x: 0, y: 0 };
    this.__scale = { x: 1, y: 1 };

    this.initCanvas();
    this.initEvents();

    var json = mzm;
    this.map = new Map(this.__canvas, this.__ctx, json);
}

Main.prototype = {
    //#region fields
    __canvas: null,
    __ctx: null,
    __translation: null,
    __scale: null,

    __canvasClicked: false,
    __prevMousePosition: null,


    map: null,
    //#endregion

    //#region Transformations

    translate: function Main$translate(x, y)
    {
        x = this.__translation.x + x;
        y = this.__translation.y + y;
        x = Math.min(0, x);
        y = Math.min(0, y);

        x = Math.max(-(this.map.boundX - this.__canvas.width), x);
        y = Math.max(-(this.map.boundY - this.__canvas.height), y);

        this.__translation = { x: x, y: y };
        this.draw();
    },

    //#endregion

    //#region Events

    initEvents: function Main$initEvents()
    {
        window.addEventListener("resize", $$fcd(this, this.__onResize));
        window.addEventListener("keydown", $$fcd(this, this.__onKeyDown));

        this.__canvas.addEventListener("click", $$fcd(this, this.__onClick));
        this.__canvas.addEventListener("contextmenu", $$fcd(this, this.__onRightClick));
        this.__canvas.addEventListener("mousedown", $$fcd(this, this.__onMouseDown));
        window.addEventListener("mouseup", $$fcd(this, this.__onMouseUp));
        this.__canvas.addEventListener("mousemove", $$fcd(this, this.__onMouseMove));

        this.__canvas.addEventListener("mousewheel", $$fcd(this, this.__onWheel));
    },

    __onClick: function Main$__onClick(event)
    {
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);

        this.map.addBlock(gridPosition);
        this.draw();
    },

    __onRightClick: function Main$__onRightClick(event) {
        event.preventDefault();
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);

        this.map.removeBlock(gridPosition);
        this.draw();
        return false;
    },

    __onResize: function Main$__onResize(event)
    {
        this.resizeCanvas();
        this.draw();
    },

    __onMouseDown: function Main$__onMouseDown(event)
    {
        this.__canvasClicked = true;
        this.__prevMousePosition = this.getMousePosition(event);
    },

    __onMouseMove: function Main$__onMouseMove(event)
    {
        if (this.__canvasClicked)
        {
            var curMousePosition = this.getMousePosition(event);
            var dx = curMousePosition.x - this.__prevMousePosition.x;
            var dy = curMousePosition.y - this.__prevMousePosition.y;
            this.translate(dx, dy);

            this.__prevMousePosition = curMousePosition;
        }
    },

    __onMouseUp: function Main$__onMouseUp()
    {
        this.__canvasClicked = false;
        this.__prevMousePosition = null;
    },

    __onWheel: function Main$__onWheel(event)
    {
        var delta = (event.deltaY > 0) ? 0.1 : -0.1;

        var x = this.__scale.x + delta;
        var y = this.__scale.y + delta;
        this.__scale = { x: x, y: y };
        this.draw();
    },

    __onKeyDown: function Main$__onKeyDown(event)
    {
        switch (event.keyCode) {
            case 78:
                this.map.addNewRoom({ grid: [] });
                break;
            case 83:
                this.map.serialize();
                break;
            case 84:
                this.map.toggleStyle();
                this.draw();
                break;
        }
    },

    //#endregion

    //#region Canvas

    initCanvas: function Main$initCanvas()
    {
        if (!this.__canvas) {
            this.__canvas = document.getElementById("canvas");
            this.__ctx = this.__canvas.getContext("2d");
        }

        this.resizeCanvas();
    },

    resizeCanvas: function Main$resizeCanvas()
    {
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;
    },

    getMousePosition: function Main$getMousePosition(event)
    {
        var rect = this.__canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    //#endregion

    draw: function Main$draw()
    {
        this.__ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.__ctx.clearRect(0, 0, this.__canvas.width, this.__canvas.height);
        this.__ctx.scale(this.__scale.x, this.__scale.y);

        this.__ctx.translate(this.__translation.x, this.__translation.y);

        this.map.draw();
    }
};