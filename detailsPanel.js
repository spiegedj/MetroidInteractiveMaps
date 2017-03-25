function DetailsPanel(canvas, context) {
    this.__canvas = canvas;
    this.__ctx = context;
}

DetailsPanel.prototype = {
    __canvas: null,
    __ctx: null,

    __selectedType: null,

    dim: { width: 300, height: 500 },
    padding: {top: 15, bottom: 15, left: 15, right: 15},

    getPosition: function DetailsPanel$getPosition()
    {
        return {
            x: (this.__canvas.width) - this.dim.width,
            y: (this.__canvas.height / 2) - (this.dim.height / 2)
        }
    },

    setSelected: function DetailsPanel$setSelected(selectedType)
    {
        this.__selectedType = selectedType;
        this.draw();
    },

    //#region rendering

    draw: function DetailsPanel$draw()
    {
        if (!this.__selectedType) return;

        var settings = saveContext(this.__ctx);

        this.__ctx.imageSmoothingEnabled = false;
        var pos = this.getPosition();

        this.__ctx.strokeStyle = "rgb(255, 255, 255)";
        this.__ctx.lineWidth = 2;
        this.__ctx.fillStyle = "rgb(100,0,0)";

        this.__ctx.fillRect(pos.x, pos.y, this.dim.width, this.dim.height);
        this.__ctx.strokeRect(pos.x, pos.y, this.dim.width + 5, this.dim.height);


        // Image
        var item = Images[this.__selectedType];
        if (item) {
            var aspect = item.height / item.width;
            var scale = 50;
            this.__ctx.drawImage(item, pos.x, pos.y, scale, scale * aspect);
        }

        // Details
        var details = ItemDetails[this.__selectedType];
        if (details)
        {
            this.__ctx.font = "20px Arial";
            this.__ctx.fillStyle = "White";
            this.__ctx.textAlign = "center";
            this.__ctx.textBaseline = "top";
            this.__ctx.fillText(details.name, pos.x + this.dim.width / 2, pos.y + this.padding.top);
        }

        restoreContext(this.__ctx, settings);
    }

    //#endregion
};