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
        }
    }

    Images[key].onload = callback;
};

BlockTypes = {};
BlockTypes.m0 = {
    Normal: { noImage: true },
    Save: { scale: .05 },
    Map: { scale: .05 },
    TunnelHorizontal: { noImage: true },
    TunnelVertical: { noImage: true },
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
    Save: { scale: .05 },
    Map: { scale: .05 },
    //EnergyRecharge: { scale: .05 },
    MissileRecharge: { scale: .05 },
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
    SpringBall: {},
    SpeedBooster: {},
    Varia: {},
    WaveBeam: {},
    XRayScope: {},

    Missile2: {},
    MissileSuperMissile: {},
}