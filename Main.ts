/// <reference path="Games.ts"/>
/// <reference path="DetailsPanel.ts"/>
/// <reference path="Globals.ts"/>
/// <reference path="Block.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="MMap.ts"/>
/// <reference path="Elevator.ts"/>

class Main {
    //#region Fields
    private __canvas: HTMLCanvasElement;
    private __hiddenCanvas: HTMLCanvasElement;
    private __ctx: CanvasRenderingContext2D;
    private __mainCtx: CanvasRenderingContext2D;
    private __translation: Point;
    private __scale: Point;
    private __blockType: string = "Normal";
    private __doorType: any = DoorType.Normal;

    private __prevMousePosition: Point;
    private __currentStyle: string;
    private __currentArea: string;
    private __canvasClicked: boolean = false;
    private __ctlDown: boolean = false;
    private __altDown: boolean = false;

    public hiddenCanvasOffset: Point;
    public map: MMap;
    public game: string;
    public detailsPanel: DetailsPanel;
    //#endregion

    constructor() {
        this.__translation = { x: 0, y: 0 };
        this.__scale = { x: 1, y: 1 };

        this.game = getQueryVariable('g') || 'm0';
        this.__currentArea = Areas.nextArea(this.game);
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

    public translate(x: number, y: number): void
    {
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
            y - this.__canvas.height < this.hiddenCanvasOffset.y - this.__hiddenCanvas.height
            ) {
            this.resizeHiddenCanvas();
            this.draw();
            console.log("Redrawn!");


        } else {
            this.drawMainCanvas();
        }
    }

    public translateTo(tx: number, ty: number): void
    {
        this.translate(tx - this.__translation.x, ty - this.__translation.y);
    }

    public centerCanvas(): void
    {
        var bounds = this.getPixelBounds();
        var tx = (bounds.x / 2) - (this.__canvas.width / 2);
        var ty = (bounds.y / 2) - (this.__canvas.height / 2);

        this.translateTo(-tx, 0);
    }

    //#endregion

    //#region Events

    public initEvents(): void
    {
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

    private __onClick(event: MouseEvent): void
    {
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);

        if (this.__ctlDown) {
            this.map.addBlock(gridPosition, this.__blockType);
            this.draw();
        } if (this.__altDown) {
            this.map.addElevatorPoint(gridPosition);
            this.draw();
        } else {
            var block = this.map.selectRoom(gridPosition);
            if (block) 
            {
                this.detailsPanel.setSelected(block);
                this.__currentArea = block.getArea();
            }
            this.draw();
        }
    }

    private __onRightClick(event: MouseEvent): boolean {
        event.preventDefault();
        var mousePosition = this.getMousePosition(event);
        var gridPosition = this.map.mouseToGrid(mousePosition, this.__translation);

        this.map.removeBlock(gridPosition);
        this.draw();
        return false;
    }

    private __onResize(): void
    {
        this.resizeCanvas();
        this.draw();
    }

    private __onMouseDown(event: MouseEvent): void
    {
        this.__canvasClicked = true;
        this.__prevMousePosition = this.getMousePosition(event);
    }

    private __onMouseMove(event: MouseEvent): void
    {
        if (this.__canvasClicked)
        {
            var curMousePosition = this.getMousePosition(event);
            var dx = curMousePosition.x - this.__prevMousePosition.x;
            var dy = curMousePosition.y - this.__prevMousePosition.y;

            this.translate(dx, dy);

            this.__prevMousePosition = curMousePosition;
        }
    }

    private __onMouseUp(): void
    {
        this.__canvasClicked = false;
        this.__prevMousePosition = null;
    }

    private __onWheel (event: WheelEvent): void
    {
        var maxSizeX = (this.__canvas.width / this.map.boundX);
        var maxSizeY = (this.__canvas.height / this.map.boundY);
        var maxSize = Math.max(maxSizeX, maxSizeY);

        var delta = (event.deltaY > 0) ? -10 : 10;
        if (this.map.size + delta < maxSize) return;

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

    private __onKeyDown(event: KeyboardEvent)
    {
        switch (event.keyCode) {
            case 78: // N
                this.map.addNewRoom({ grid: [], styleName: this.__currentStyle, area: this.__currentArea });
                this.draw();
                break;
            case 83: // S
                this.map.serialize();
                break;
            case 90: // Z
                this.__currentStyle = this.map.toggleStyle();
                this.draw();
                break;
            case 88: // Z
                this.__currentArea = this.map.toggleArea();
                this.draw();
                break;
            case 17: // Ctl
                this.__ctlDown = true;
                break;
            case 18: // Alt
                this.__altDown = true;
                break;
            case 86: // v
                this.map.addNewElevator({});
                this.draw();
                break;

            case 37: // Left Arrow
                if (this.__ctlDown) {
                    this.map.translateArea(this.__currentArea, -1, 0);
                } else {
                    this.map.addDoor(Direction.Left, this.__doorType);
                }
                this.draw();
                break;
            case 39: // Right Arrow
                if (this.__ctlDown) {
                    this.map.translateArea(this.__currentArea, 1, 0);
                } else {
                    this.map.addDoor(Direction.Right, this.__doorType);
                }
                this.draw();
                break;
            case 38: // Up Arrow
                if (this.__ctlDown) {
                    this.map.translateArea(this.__currentArea, 0, -1);
                } else {
                    this.map.addDoor(Direction.Up, this.__doorType);
                }
                this.draw();
                break;
            case 40: // Down Arrow
                if (this.__ctlDown) {
                    this.map.translateArea(this.__currentArea, 0, 1);
                } else {
                    this.map.addDoor(Direction.Down, this.__doorType);
                }
                this.draw();
                break;
        }

        // Images
        var keys = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72, 75];
        var i = 0;
        var blockType;
        for (blockType in BlockTypes[this.game])
        {
            if (event.keyCode === keys[i])
            {
                this.__blockType = blockType;
                Output.write("Block Type Switched: " + this.__blockType);
                break;
            }
            i++;
        }

        // Door Types
        keys = [97,98,99,100,101,102,103];
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

    private __onKeyUp(event: KeyboardEvent): void
    {
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

    public initCanvas(): void
    {
        if (!this.__canvas) {
            this.__canvas = document.getElementById("canvas") as HTMLCanvasElement;
        }

        this.__mainCtx = this.__canvas.getContext("2d");
        this.resizeCanvas();
    }

    public initHiddenCanvas(): void
    {
        this.__hiddenCanvas = document.getElementById("hiddenCanvas") as HTMLCanvasElement;
        this.__ctx = this.__hiddenCanvas.getContext("2d");
        this.__ctx.imageSmoothingEnabled = false;
    }

    public resizeHiddenCanvas(): void
    {
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
        } else {
            this.hiddenCanvasOffset = { x: 0, y: 0 };
            this.__hiddenCanvas.width = pixelBounds.x;
            this.__hiddenCanvas.height = pixelBounds.y;
        }
    }

    public resizeCanvas(): void
    {
        this.__canvas.width = window.innerWidth;
        this.__canvas.height = window.innerHeight;
    }

    public getMousePosition(event): Point
    {
        var rect = this.__canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    public getTranslationCenter(): Point
    {
        var x = this.__translation.x - (this.__canvas.width / 2);
        var y = this.__translation.y - (this.__canvas.height / 2);
        return { x: x, y: y };
    }

    public getPixelBounds(): Point
    {
        return {
            x: this.map.boundX * this.map.size,
            y: this.map.boundY * this.map.size
        }
    }

    //#endregion

    public draw(): void
    {
        this.__ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.__ctx.imageSmoothingEnabled = false;
        this.__ctx.translate(this.hiddenCanvasOffset.x, this.hiddenCanvasOffset.y);
        this.map.draw();

        this.drawMainCanvas();
    }

    drawMainCanvas(): void
    {
        redraw = this.drawMainCanvas.bind(this);
        var mainCanvasTranslation = {
            x: this.__translation.x - this.hiddenCanvasOffset.x,
            y: this.__translation.y - this.hiddenCanvasOffset.y
        }

        this.__mainCtx.drawImage(this.__hiddenCanvas, mainCanvasTranslation.x, mainCanvasTranslation.y);

        this.detailsPanel.draw();
    }
};

var redraw;