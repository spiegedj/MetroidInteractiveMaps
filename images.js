Images = {};

Images.BuildImages = function Images$BuildImages(game, callback) {
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

    Images[key].onload = callback;
};

ItemDetails =
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

BlockTypes = {};
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