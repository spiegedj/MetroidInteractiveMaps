function Canvas() {
    this.initCanvas();
    this.initHiddenCanvas();
}

Canvas.prototype = {
    __canvas: null,
    __ctx: null,

    

    //#region Init

    initCanvas: function Canvas$initCanvas() {
        if (!this.__canvas) {
            this.__canvas = document.getElementById("canvas");
        }

        this.resizeCanvas();
    },

    initHiddenCanvas: function Canvas$initHiddenCanvas() {
        this.__hiddenCanvas = document.getElementById("hiddenCanvas");
        this.__ctx = this.__hiddenCanvas.getContext("2d");
        this.__ctx.imageSmoothingEnabled = false;
    },

    //#endregion

    resizeHiddenCanvas: function Canvas$resizeHiddenCanvas() {
        this.pixelBoundX = this.map.boundX * this.map.size;
        this.pixelBoundY = this.map.boundY * this.map.size;

        this.__hiddenCanvas.width = this.pixelBoundX;
        this.__hiddenCanvas.height = this.pixelBoundY;
    },

    resizeCanvas: function Canvas$resizeCanvas() {
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;
    },

    getMousePosition: function Canvas$getMousePosition(event) {
        var rect = this.__canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    },

    addEventListener: function Canvas$addEventListener() {
        this.__canvas.addEventListener.apply(this.__canvas, arguments);
    }
};