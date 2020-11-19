// Function that collects all inputs

function inputs (time, delta, sprite_var, self)
{
    var matterSprite = sprite_var;

    // Resets the game upon S press

    if (cursors.down.isDown) {
        self.scene.stop();
        if (current_level == 'level0') {
            current_level = 'level1';
        } else {
            current_level = 'level0';
        }
        self.scene.start('main');
    }

    // Horizontal movement

    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;

    if (cursors.left.isDown && !playerController.blocked.left)
    {
        smoothedControls.moveLeft(delta);
        matterSprite.anims.play('left', true);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
        oldVelocityX = matterSprite.body.velocity.x;
        targetVelocityX = -playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -smoothedControls.value);

        matterSprite.setVelocityX(newVelocityX);
    }
    else if (cursors.right.isDown && !playerController.blocked.right)
    {
        smoothedControls.moveRight(delta);
        matterSprite.anims.play('right', true);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
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