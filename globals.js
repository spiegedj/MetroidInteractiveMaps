function $$fcd(instance, method) {
    return function () {
        return method.apply(instance, arguments);
    };
}

function guid() {
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

Enums = {};
Enums.Direction =
{
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right'
}

Output = {};
Output.write = function (message)
{
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = message;
}

saveContext = function (ctx) 
{
    return {
        strokeStyle: ctx.strokeStyle,
        fillStyle: ctx.fillStyle,
        lineWidth: ctx.lineWidth,
        font: ctx.font
    }
};

restoreContext = function (ctx, settings) {
    ctx.strokeStyle = settings.strokeStyle;
    ctx.fillStyle = settings.fillStyle;
    ctx.lineWidth = settings.lineWidth;
    ctx.font = settings.font;
};