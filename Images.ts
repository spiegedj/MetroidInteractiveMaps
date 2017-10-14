var Images: any = {};
Images.BuildImages = function Images$BuildImages(game: string, callback: Function) : void {
    for (var key in BlockTypes[game])
    {
        var blockType = BlockTypes[game][key];
        BlockTypes[key] = key;

        if (!blockType.noImage) {
            Images[key] = new Image();
            Images[key].src = 'images/' + game + '/' + key + '.png';
            Images[key]._scale = blockType.scale || .035;
            Images[key]._outlined = blockType.outlined;
        }
    }

    for (var areaName in Areas[game]) {
        if (areaName !== "Elevator") {
            Areas[game][areaName] = new Image();
            Areas[game][areaName].src = 'images/' + game + '/' + areaName + '.png';
        }
    }

    // if (!key) { return; }
    // Images[key].onload = callback;

    Areas[game][areaName].onload = callback;
};

var Areas: any = {};
Areas = {
    m0: {
        Crateria: {},
        Brinstar: {},
        Chozodia: {},
        Tourian: {},
        Ridley: {},
        Kraid: {},
        Norfair: {},
    },
    m3: {
        Crateria: {},
        Brinstar: {},
        "Wrecked Ship": {},
        Tourian: {},
        Maridia: {},
        Norfair: {},
    },
    m4: {
        "Main Deck": {},
        "Sector 1": {},
        "Sector 2": {},
        "Sector 3": {},
        "Sector 4": {},
        "Sector 5": {},
        "Sector 6": {},
    }
}

Areas.nextArea = function(game: string, curArea: string) : string {
    var areas = Object.keys(Areas[game]);
    for (var i = 0; i < areas.length; i++) {
        if (areas[i] === curArea) {
            return areas[(i + 1) % areas.length];
        }
    }
    return areas[0];
};

var BlockTypes: any = {};
BlockTypes.m0 = {
    Normal: { noImage: true },
    Save: { scale: .05, outlined: true },
    Map: { scale: .05, outlined: true },
    TunnelHorizontal: { noImage: true, outlined: true },
    TunnelVertical: { noImage: true, outlined: true },
    Chozo: {},
    Missile: {},
    EnergyTank: {},
    SuperMissile: {},
    PowerBomb: {},
    Bomb: {},
    ChargeBeam: {},
    HiJumpBoots: {},
    IceBeam: {},
    LongBeam: {},
    Morphball: {},
    PowerGrip: {},
    ScrewAttack: {},
    SpeedBooster: {},
    UnknownItem1: {},
    UnknownItem2: {},
    UnknownItem3: {},
    Varia: {},
    WaveBeam: {},
    ZipLineActivator: {}
};

BlockTypes.m3 = {
    Normal: { noImage: true },
    Save: { scale: .05, outlined: true },
    Map: { scale: .05, outlined: true },
    EnergyRecharge: { scale: .05, outlined: true },
    MissileRecharge: { scale: .05, outlined: true },
    Recharge: { scale: .04, outlined: true },
    TunnelHorizontal: { noImage: true },
    TunnelVertical: { noImage: true },
    Missile: {},
    EnergyTank: {},
    SuperMissile: {},
    PowerBomb: { scale: .04 },
    ReserveTank: {},

    Bomb: {},
    ChargeBeam: {},
    GrapplingBeam: {},
    GravitySuit: {},
    HiJumpBoots: {},
    IceBeam: {},
    Morphball: {},
    PlasmaBeam: {},
    ScrewAttack: {},
    SpaceJump: {},
    Spazer: {},
    SpringBall: {},
    SpeedBooster: {},
    Varia: {},
    WaveBeam: {},
    XRayScope: {},

    Missile2: {},
    MissileSuperMissile: {},
}

BlockTypes.m4 = {
    Normal: { noImage: true },
    Save: { scale: .05, outlined: true },
    Navigation: { scale: .05, outlined: true },
    Recharge: { scale: .05, outlined: true },
    Data: { scale: .05, outlined: true },
    TunnelHorizontal: { noImage: true, outlined: true },
    TunnelVertical: { noImage: true, outlined: true },
    Missile: {},
    EnergyTank: {},
    PowerBomb: {}
}

var ItemDetails =
{
    Missile: {
        name: "Missile Expansion"
    },
    EnergyTank: {
        name: "Energy Tank"
    },
    SuperMissile: {
        name: "Super Missile Expansion"
    },
};