/// <reference path="Games.ts"/>
/// <reference path="DetailsPanel.ts"/>
/// <reference path="Globals.ts"/>
/// <reference path="Block.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="MMap.ts"/>
/// <reference path="Elevator.ts"/>
class Main {
    //#endregion
    constructor() {
        this.__blockType = "Normal";
        this.__doorType = DoorType.Normal;
        this.__canvasClicked = false;
        this.__ctlDown = false;
        this.__altDown = false;
        this.__translation = { x: 0, y: 0 };
        this.__scale = { x: 1, y: 1 };
        this.game = getQueryVariable('g') || 'm0';
        var json = games[this.game];
        this.initCanvas();
        this.initHiddenCanvas();
        this.initEvents();
        this.map = new MMap(this.__canvas, this.__ctx, json);
        this.resizeHiddenCanvas();
        Images.BuildImages(this.game, this.draw.bind(this));
        this.detailsPanel = new DetailsPanel(this.__canvas, this.__mainCtx, this.map);
        this.hiddenCanvasOffset = { x: 0, y: 0 };
        this.centerCanvas();
    }
    //#region Transformations
    translate(x, y) {
        x = Math.min(this.__translation.x + x, 0);
        y = Math.min(this.__translation.y + y, 0);
        var pixelBounds = this.getPixelBounds();
        x = Math.max(-(pixelBounds.x - this.__canvas.width), x);
        y = Math.max(-(pixelBounds.y - this.__canvas.height), y);
        this.__translation = { x: x, y: y };
        // Check if we need to redraw
        if (x > this.hiddenCanvasOffset.x ||
            y > this.hiddenCanvasOffset.y ||
            x - this.__canvas.width < this.hiddenCanvasOffset.x - this.__hiddenCanvas.width ||
            y - this.__canvas.height < this.hiddenCanvasOffset.y - this.__hiddenCanvas.height) {
            this.resizeHiddenCanvas();
            this.draw();
            console.log("Redrawn!");
        }
        else {
            this.drawMainCanvas();
        }
    }
    translateTo(tx, ty) {
        this.translate(tx - this.__translation.x, ty - this.__translation.y);
    }
    centerCanvas() {
        var bounds = this.getPixelBounds();
        var tx = (bounds.x / 2) - (this.__canvas.width / 2);
        var ty = (bounds.y / 2) - (this.__canvas.height / 2);
        this.translateTo(-tx, 0);
    }
    //#endregion
    //#region Events
    initEvents() {
        window.addEventListener("resize", this.__onResize.bind(this));
        window.addEventListener("keydown", this.__onKeyDown.bind(this));
        window.addEventListener("keyup", this.__onKeyUp.bind(this));
        window.addEventListener("mouseup", this.__onMouseUp.bind(this));
        this.__canvas.addEventListener("click", this.__onClick.bind(this));
        this.__canvas.addEventListener("contextmenu", this.__onRightClick.bind(this));
        this.__canvas.addEventListener("mousedown", this.__onMouseDown.bind(this));
        this.__canvas.addEventListener("mousemove", this.__onMouseMove.bind(this));
        this.__canvas.addEventListener("mousewheel", this.__onWheel.bind(this));
    }
    __onClick(event) {
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);
        if (this.__ctlDown) {
            this.map.addBlock(gridPosition, this.__blockType);
        }
        if (this.__altDown) {
            this.map.addElevatorPoint(gridPosition);
        }
        else {
            var block = this.map.selectRoom(gridPosition);
            if (block) {
                this.detailsPanel.setSelected(block);
            }
        }
        this.draw();
    }
    __onRightClick(event) {
        event.preventDefault();
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);
        this.map.removeBlock(gridPosition);
        this.draw();
        return false;
    }
    __onResize() {
        this.resizeCanvas();
        this.draw();
    }
    __onMouseDown(event) {
        this.__canvasClicked = true;
        this.__prevMousePosition = this.getMousePosition(event);
    }
    __onMouseMove(event) {
        if (this.__canvasClicked) {
            var curMousePosition = this.getMousePosition(event);
            var dx = curMousePosition.x - this.__prevMousePosition.x;
            var dy = curMousePosition.y - this.__prevMousePosition.y;
            this.translate(dx, dy);
            this.__prevMousePosition = curMousePosition;
        }
    }
    __onMouseUp() {
        this.__canvasClicked = false;
        this.__prevMousePosition = null;
    }
    __onWheel(event) {
        var maxSizeX = (this.__canvas.width / this.map.boundX);
        var maxSizeY = (this.__canvas.height / this.map.boundY);
        var maxSize = Math.max(maxSizeX, maxSizeY);
        var delta = (event.deltaY > 0) ? -10 : 10;
        if (this.map.size + delta < maxSize)
            return;
        var previousSize = this.map.size;
        var p = 1 / (this.map.size / (this.map.size + delta));
        this.map.size += delta;
        this.resizeHiddenCanvas();
        //var translationCenter = this.getMousePosition(event);
        //translationCenter.x = (-translationCenter.x) + this.__translation.x;
        //translationCenter.y = (-translationCenter.y) + this.__translation.y;
        var translationCenter = this.getTranslationCenter();
        var newTranslationCenterX = (translationCenter.x / previousSize) * this.map.size;
        var newTranslationCenterY = (translationCenter.y / previousSize) * this.map.size;
        var tx = newTranslationCenterX + (this.__canvas.width / 2);
        var ty = newTranslationCenterY + (this.__canvas.height / 2);
        this.draw();
        this.translateTo(tx, ty);
    }
    __onKeyDown(event) {
        switch (event.keyCode) {
            case 78:// N
                this.map.addNewRoom({ grid: [], styleName: this.__currentStyle });
                this.draw();
                break;
            case 83:// S
                this.map.serialize();
                break;
            case 90:// Z
                this.__currentStyle = this.map.toggleStyle();
                this.draw();
                break;
            case 17:// Ctl
                this.__ctlDown = true;
                break;
            case 18:// Alt
                this.__altDown = true;
                break;
            case 86:// v
                this.map.addNewElevator({});
                this.draw();
                break;
            case 37:// Left Arrow
                this.map.addDoor(Direction.Left, this.__doorType);
                this.draw();
                break;
            case 39:// Right Arrow
                this.map.addDoor(Direction.Right, this.__doorType);
                this.draw();
                break;
            case 38:// Up Arrow
                this.map.addDoor(Direction.Up, this.__doorType);
                this.draw();
                break;
            case 40:// Down Arrow
                this.map.addDoor(Direction.Down, this.__doorType);
                this.draw();
                break;
        }
        // Images
        var keys = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72, 75];
        var i = 0;
        var blockType;
        for (blockType in BlockTypes[this.game]) {
            if (event.keyCode === keys[i]) {
                this.__blockType = blockType;
                Output.write("Block Type Switched: " + this.__blockType);
                break;
            }
            i++;
        }
        // Door Types
        keys = [97, 98, 99, 100, 101];
        i = 0;
        var doorType;
        for (doorType in DoorType) {
            if (event.keyCode === keys[i]) {
                this.__doorType = DoorType[doorType];
                Output.write("Door Type Switched: " + this.__doorType);
                break;
            }
            i++;
        }
    }
    __onKeyUp(event) {
        switch (event.keyCode) {
            case 17:
                this.__ctlDown = false;
                break;
            case 18:
                this.__altDown = false;
                break;
        }
    }
    //#endregion
    //#region Canvas
    initCanvas() {
        if (!this.__canvas) {
            this.__canvas = document.getElementById("canvas");
        }
        this.__mainCtx = this.__canvas.getContext("2d");
        this.resizeCanvas();
    }
    initHiddenCanvas() {
        this.__hiddenCanvas = document.getElementById("hiddenCanvas");
        this.__ctx = this.__hiddenCanvas.getContext("2d");
        this.__ctx.imageSmoothingEnabled = false;
    }
    resizeHiddenCanvas() {
        var hCanvasMax = 4000;
        var pixelBounds = this.getPixelBounds();
        if (pixelBounds.x > 3000 || pixelBounds.y > 3000) {
            this.__hiddenCanvas.width = hCanvasMax;
            this.__hiddenCanvas.height = hCanvasMax;
            var translationCenter = this.getTranslationCenter();
            this.hiddenCanvasOffset = {
                x: Math.min(translationCenter.x + (hCanvasMax / 2), 0),
                y: Math.min(translationCenter.y + (hCanvasMax / 2), 0)
            };
        }
        else {
            this.hiddenCanvasOffset = { x: 0, y: 0 };
            this.__hiddenCanvas.width = pixelBounds.x;
            this.__hiddenCanvas.height = pixelBounds.y;
        }
    }
    resizeCanvas() {
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;
    }
    getMousePosition(event) {
        var rect = this.__canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    getTranslationCenter() {
        var x = this.__translation.x - (this.__canvas.width / 2);
        var y = this.__translation.y - (this.__canvas.height / 2);
        return { x: x, y: y };
    }
    getPixelBounds() {
        return {
            x: this.map.boundX * this.map.size,
            y: this.map.boundY * this.map.size
        };
    }
    //#endregion
    draw() {
        this.__ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.__ctx.imageSmoothingEnabled = false;
        this.__ctx.translate(this.hiddenCanvasOffset.x, this.hiddenCanvasOffset.y);
        this.map.draw();
        this.drawMainCanvas();
    }
    drawMainCanvas() {
        var mainCanvasTranslation = {
            x: this.__translation.x - this.hiddenCanvasOffset.x,
            y: this.__translation.y - this.hiddenCanvasOffset.y
        };
        this.__mainCtx.drawImage(this.__hiddenCanvas, mainCanvasTranslation.x, mainCanvasTranslation.y);
        this.detailsPanel.draw();
    }
}
;
