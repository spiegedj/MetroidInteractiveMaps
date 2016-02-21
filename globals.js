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