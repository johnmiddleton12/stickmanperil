// Function that collects all inputs

function inputs (time, delta, sprite_var, self)
{
    var matterSprite = sprite_var;

    // Resets the game upon S press

    // if (cursors.down.isDown) {
    //     self.scene.stop();
    //     if (current_level == 'level0') {
    //         current_level = 'level1';
    //     } else {
    //         current_level = 'level0';
    //     }
    //     self.scene.start('main');
    // }
    // if ((self.bodyA === self.playerBody && self.bodyB === self.door_sensor_body && cursors.down.isDown) ||
    //     (self.bodyA === self.door_sensor_body && bodyB === self.playerBody && cursors.down.isDown))
    //     {
    //         self.matter.world.remove(door_sensor_body);
    //         self.scene.stop();
    //         if (current_level == 'level0') {
    //             current_level = 'level1';
    //         } else {
    //             current_level = 'level0';
    //         }
    //         self.scene.start('main');
            
    //     }


    // Horizontal movement

    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;

    if (cursors.down.isDown && touching_door === true) {
        // self.matter.world.remove(door_sensor_body);
        touching_door = false;
        self.scene.stop();
        if (current_level == 'level0') {
            current_level = 'level1';
        } else {
            current_level = 'level0';
        }
        self.scene.start('main');
    }

    if (cursors.left.isDown && !playerController.blocked.left)
    {
        smoothedControls.moveLeft(delta);
        matterSprite.anims.play('left', true);

        oldVelocityX = matterSprite.body.velocity.x;
        targetVelocityX = -playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -smoothedControls.value);

        matterSprite.setVelocityX(newVelocityX);
    }
    else if (cursors.right.isDown && !playerController.blocked.right)
    {
        smoothedControls.moveRight(delta);
        matterSprite.anims.play('right', true);

        oldVelocityX = matterSprite.body.velocity.x;
        targetVelocityX = playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, smoothedControls.value);

        matterSprite.setVelocityX(newVelocityX);
    }
    else
    {
        smoothedControls.reset();
        matterSprite.anims.play('idle', true);
    }

    // Jumping and wall jumping

    var canJump = (time - playerController.lastJumpedAt) > 250;

    if (cursors.up.isDown & canJump)
    {
        if (playerController.blocked.bottom)
        {
            matterSprite.setVelocityY(-playerController.speed.jump);
            playerController.lastJumpedAt = time;
        } 
        else if (playerController.blocked.left)
        {
            matterSprite.setVelocityX(playerController.speed.sideJump);
            matterSprite.setVelocityY(-playerController.speed.jump);
            playerController.lastJumpedAt = time;
        }
        else if (playerController.blocked.right)
        {
            matterSprite.setVelocityX(-playerController.speed.sideJump);
            matterSprite.setVelocityY(-playerController.speed.jump);
            playerController.lastJumpedAt = time;
        }
    }
}