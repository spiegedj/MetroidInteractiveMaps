class RoomStyle {
    public roomStyles: any;
    public styleName: string;

    constructor (styleName: string, game: string) 
    {
        this.roomStyles = RoomStyle.Styles[game];
        this.styleName = styleName || Object.keys(this.roomStyles)[0];
    }

    public getLineColor(): string
    {
        return this.roomStyles[this.styleName].lineColor;
    }

    public getRoomColor(): string
    {
        return this.roomStyles[this.styleName].roomColor;
    }

    public nextStyle(): void
    {
        var styleKeys = Object.keys(this.roomStyles);
        for (var i = 0; i < styleKeys.length; i++) {
            if (styleKeys[i] === this.styleName) {
                this.styleName = styleKeys[(i + 1) % styleKeys.length];
                return;
            }
        }
    }

    public static Styles: any = {
        m0: {
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
                roomColor: "rgb(254,105,25)"
            }
        }, 

        m3: {
            Crateria: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(129,76,40)",
            },

            WreckedShip: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(83,90,97)",
            },


            Tourian: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(150,56,109)",
            },

            Brinstar: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(35,131,0)",
            },

            Maridia: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(41,90,202)",
            },

            Norfair: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(145,45,45)",
            },

            Elevator: {
                lineColor: 'rgb(255,253,249)',
                roomColor: "rgb(0,0,0)",
            }
        }
    }
};

