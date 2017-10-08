function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

var Output:any = {};
Output.write = function (message)
{
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = message;
}

function saveContext (ctx: CanvasRenderingContext2D) 
{
    return {
        strokeStyle: ctx.strokeStyle,
        fillStyle: ctx.fillStyle,
        lineWidth: ctx.lineWidth,
        font: ctx.font
    }
}

function restoreContext(ctx: CanvasRenderingContext2D, settings: any): void {
    ctx.strokeStyle = settings.strokeStyle;
    ctx.fillStyle = settings.fillStyle;
    ctx.lineWidth = settings.lineWidth;
    ctx.font = settings.font;
}