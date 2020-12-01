// import PhaserMatterCollisionPlugin from "node_modules/phaser-matter-collision-plugin";
// const { PhaserMatterCollisionPlugin } = require("phaser-matter-collision-plugin");


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            enableSleep: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    },
    // Install the scene plugin
    plugins: {
      scene: [
        {
          plugin: PhaserMatterCollisionPlugin, // The plugin class
          key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
          mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
        }
      ]
    }
};

var game = new Phaser.Game(config);
var playerController;
var cursors;
var text;
var cam;
var smoothedControls;
var map;
var tileset;
var bgLayer;
var groundLayer;
var fgLayer;
var current_level = 'level0';
var touching_door = false;

var SmoothedHorionztalControl = new Phaser.Class({

    initialize:

    function SmoothedHorionztalControl (speed)
    {
        this.msSpeed = speed;
        this.value = 0;
    },

    moveLeft: function (delta)
    {
        if (this.value > 0) { this.reset(); }
        this.value -= this.msSpeed * delta;
        if (this.value < -1) { this.value = -1; }
        playerController.time.rightDown += delta;
    },

    moveRight: function (delta)
    {
        if (this.value < 0) { this.reset(); }
        this.value += this.msSpeed * delta;
        if (this.value > 1) { this.value = 1; }
    },

    reset: function ()
    {
        this.value = 0;
    }
});

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.tilemapTiledJSON('level0', 'assets/matter-platformer-dynamic-example.json');
    this.load.tilemapTiledJSON('level1', 'assets/level1.json');
    this.load.image('kenney_redux_64x64', 'assets/kenney_redux_64x64.png');
    this.load.spritesheet('player', 'assets/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
    this.load.image('box', 'assets/box-item-boxed.png');

    this.load.spritesheet('stickman', 'assets/stickman/final_stickman.png', { frameWidth: 51, frameHeight: 51 });
}

function load_level (key, background, self)
{
    map = self.make.tilemap({ key: key});
    self.add.image(map.widthInPixels, map.heightInPixels, background).setScale(x = 4, y = 2);
    tileset = map.addTilesetImage('kenney_redux_64x64');
    bgLayer = map.createDynamicLayer('Background Layer', tileset, 0, 0);
    groundLayer = map.createDynamicLayer('Ground Layer', tileset, 0, 0);
    fgLayer = map.createDynamicLayer('Foreground Layer', tileset, 0, 0).setDepth(1);

    groundLayer.setCollisionByProperty({ collides: true });
    self.matter.world.convertTilemapLayer(groundLayer);

    // bgLayer.setCollisionByProperty({collides: true});
    // this.matter.world.convertTilemapLayer(bgLayer);

    // fgLayer.setCollisionByProperty({collides: false});
    // this.matter.world.convertTilemapLayer(fgLayer);

    self.matter.world.setBounds(map.widthInPixels, map.heightInPixels);

    
}

function create ()
{

    load_level(current_level, 'sky', this);

    // cursors = this.input.keyboard.createCursorKeys();

    cursors = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.W,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.A,
        right:Phaser.Input.Keyboard.KeyCodes.D});           

    smoothedControls = new SmoothedHorionztalControl(0.001);

    playerController = {
        matterSprite: this.matter.add.sprite(0, 0, 'stickman', 4).setScale(1.2),
        blocked: {
            left: false,
            right: false,
            bottom: false
        },
        numTouching: {
            left: 0,
            right: 0,
            bottom: 0
        },
        sensors: {
            bottom: null,
            left: null,
            right: null
        },
        time: {
            leftDown: 0,
            rightDown: 0
        },
        lastJumpedAt: 0,
        speed: {
            run: 5,
            jump: 7,
            sideJump: 5
        }
    };

    var M = Phaser.Physics.Matter.Matter;
    var w = playerController.matterSprite.width;
    var h = playerController.matterSprite.height;

    var playerBody = M.Bodies.rectangle(0, 0, w * 0.75, h, { chamfer: { radius: 10 } });

    playerController.sensors.bottom = M.Bodies.rectangle(0, h * 0.5, w * 0.5, 5, { isSensor: true });
    playerController.sensors.left = M.Bodies.rectangle(-w * 0.45, 0, 5, h * 0.25, { isSensor: true });
    playerController.sensors.right = M.Bodies.rectangle(w * 0.45, 0, 5, h * 0.25, { isSensor: true });
    var compoundBody = M.Body.create({
        parts: [
            playerBody, playerController.sensors.bottom, playerController.sensors.left,
            playerController.sensors.right
        ],
        restitution: 0.05 
    });

    if (current_level == 'level0') {
        var door_sensor = map.findObject('Sensors', function (obj) {
        return obj.name === 'Door Sensor';
        });

        var door_center = M.Vertices.centre(door_sensor.polygon); 
        var door_sensor_body = this.matter.add.fromVertices(
            door_sensor.x + door_center.x, door_sensor.y + door_center.y,
            door_sensor.polygon, { isStatic: true, isSensor: true}
        );
    }

    var sensor = map.findObject('Sensors', function (obj) {
        return obj.name === 'Button Press Sensor';
    });

    var center = M.Vertices.centre(sensor.polygon); 
    var sensorBody = this.matter.add.fromVertices(
        sensor.x + center.x, sensor.y + center.y,
        sensor.polygon,
        { isStatic: true, isSensor: true }
    );

    

    // door_sensor_body.collisionFilter = {
    //     'group': -1,
    //     'category': 2,
    //     'mask': 0,
    //   };
        
    playerController.matterSprite
        .setExistingBody(compoundBody)
        .setFixedRotation() 
        .setPosition(32, 1000);

    cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    smoothMoveCameraTowards(playerController.matterSprite);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('stickman', { start: 21, end: 27 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('stickman', { start: 14, end: 20 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('stickman', { start: 0, end: 13 }),
        frameRate: 10,
        repeat: -1
    });

    this.matter.world.on('collisionstart', function (event) {
        for (var i = 0; i < event.pairs.length; i++)
        {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;
            if ((bodyA === playerBody && bodyB === sensorBody) ||
                (bodyA === sensorBody && bodyB === playerBody))
            {
                this.matter.world.remove(sensorBody);

                var buttonTile = groundLayer.getTileAt(4, 18);

                buttonTile.index = 93;
                buttonTile.physics.matterBody.setFromTileCollision();

                for (var j = 5; j <= 14; j++)
                {
                    this.time.addEvent({
                        delay: (j - 5) * 50,
                        callback: function (x)
                        {
                            var bridgeTile = groundLayer.putTileAt(12, x, 19);
                            this.matter.add.tileBody(bridgeTile);
                        }.bind(this, j)
                    });
                }
            }
            // if ((bodyA === playerBody && bodyB === door_sensor_body && cursors.down.isDown) ||
            // (bodyA === door_sensor_body && bodyB === playerBody && cursors.down.isDown))
            // {
            //     // self.matter.world.remove(door_sensor_body);
            //     this.scene.stop();
            //     if (current_level == 'level0') {
            //         current_level = 'level1';
            //     } else {
            //         current_level = 'level0';
            //     }
            //     this.scene.start('main');
                
            // } 

        }
    }, this);

    if (current_level == 'level0') {
        this.matterCollision.addOnCollideStart({
            objectA: playerBody,
            objectB: door_sensor_body,
            callback: () => {
                touching_door = true;
                // test_function(this);
            }
        });
    };
    // this.matterCollision.removeOnCollideActive({
    //     objectA: playerBody,
    //     objectB: door_sensor_body,
    //     callback: () => {
    //         touching_door = false;
    //         // test_function(this);
    //     }
    // });

    this.matter.world.on('beforeupdate', function (event) {
        playerController.numTouching.left = 0;
        playerController.numTouching.right = 0;
        playerController.numTouching.bottom = 0;
    });

    this.matter.world.on('collisionactive', function (event)
    {
        var playerBody = playerController.body;
        var left = playerController.sensors.left;
        var right = playerController.sensors.right;
        var bottom = playerController.sensors.bottom;

        for (var i = 0; i < event.pairs.length; i++)
        {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;

            if (bodyA === playerBody || bodyB === playerBody)
            {
                continue;
            }
            else if (bodyA === bottom || bodyB === bottom)
            {
                playerController.numTouching.bottom += 1;
            }
            else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic))
            {
                playerController.numTouching.left += 1;
            }
            else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
            {
                playerController.numTouching.right += 1;
            }
        }
    });

    this.matter.world.on('afterupdate', function (event) {
        playerController.blocked.right = playerController.numTouching.right > 0 ? true : false;
        playerController.blocked.left = playerController.numTouching.left > 0 ? true : false;
        playerController.blocked.bottom = playerController.numTouching.bottom > 0 ? true : false;
    });

    var lines = [
        'A and D to move, W to jump, S to enter doors'
    ];
    text = this.add.text(16, 16, lines, {
        fontSize: '20px',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    text.setScrollFactor(0);
}

function update (time, delta)
{
    var matterSprite = playerController.matterSprite;

    if (current_level == "level0") {
        this.matterCollision.events.on("collisionend", function (event) {
            touching_door = false;
        });
        
    };   
    console.log(touching_door);
    inputs(time, delta, matterSprite, this);
    
    if (!matterSprite) { return; }

    if (matterSprite.y > map.heightInPixels)
    {
        restart.call(this, this.scene);
        return;
    }    

    smoothMoveCameraTowards(matterSprite, 0.9);
}

function smoothMoveCameraTowards (target, smoothFactor)
{
    if (smoothFactor === undefined) { smoothFactor = 0; }
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.5);
}

function restart ()
{
    cam.fade(500, 0, 0, 0);
    cam.shake(250, 0.01);

    this.time.addEvent({
        delay: 500,
        callback: function ()
        {
            cam.resetFX();
            this.scene.stop();
            this.scene.start('main');
        },
        callbackScope: this
    });
}