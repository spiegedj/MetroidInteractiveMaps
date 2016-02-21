function Door(canvas, context, map, properties) {
    this.__canvas = canvas;
    this.__ctx = context;
    this.__map = map;
}

Door.prototype = {
    __canvas: null,
    __ctx: null,
};