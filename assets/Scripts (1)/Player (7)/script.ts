class PlayerBehavior extends Sup.Behavior {
  awake() {
    // Call the function setSquares which build the SQUARES Array.
    Game.setSquares();
    Sup.log(SQUARES);
    // Call the function startGame to randomize the new game.
    Game.startGame();
  }

  update() {
    // Refresh the ray casting to the mouse position inside the camera screen
    ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    
    // Create a new empty variable that will as value the  differents array of the SQUARES constant
    let array;
    
    for (array of SQUARES) {
      // Check if ray intersect with a current square (index 0 of array)
      if (ray.intersectActor(array[0], false).length > 0) { // intersectActor return hit count.
        if (array[1] == "unHover") {
          // if true, set the square new siutation to isHover.
          array[1] = "isHover";
          // and call the local mouse method with the action isHover and the releted square actor
          this.mouse("isHover", array[0]);
        }

        // Check if the left click button of the mouse is pressed on a free square.
        if (Sup.Input.wasMouseButtonJustPressed(0) && array[1] == "isHover") {
          // Check if its is the player turn.
          if (turn == "cross") {
            // if true, set the square new situation to cross.
            array[1] = "cross";
            // and call the local mouse method with the action action and the related square.
            this.mouse("click", array[0]);
            
            // call a game turn.
            turn = "break"; // take control away from player.
            //this.gameTurn();
            Sup.setTimeout(300, this.gameTurn);
          }
        }
      }
      // Else if ray does not intersect wit a previous hovered square, the square change situation.
      else if(array[1] == "isHover") {
        // if true, the square new situation to unHover.
        array[1] = "unHover";
        // and call the local mouse method with action unHover and the related square actor
        this.mouse("unHover", array[0]);
      }
    }
  }
  
  mouse(action:string, square:Sup.Actor) {
    if (action == "isHover") {
      Sup.log("The mouse is over the " + square.getName());
      square.spriteRenderer.setAnimation("isHover");
    } else if (action == "unHover") {
      Sup.log("The mouse is out from the " + square.getName());
      square.spriteRenderer.setAnimation("unHover");
    } else if (action == "click") {
      Sup.log("The mouse click the " + square.getName());
      square.spriteRenderer.setAnimation("cross");
    }
  }
  
  gameTurn() {
    turn = "cross";
    
    // check if player won.
    Game.checkVictory();

    // change to computer trun if game not ended.
    if (turn !== "end") {
      turn = "circle";
      // Call for the computer turn.
      Sup.log("The computer play now!");
      Game.computerTurn();
      // check if computor won.
      Game.checkVictory();

      // change to player turn if game not ended.
      if (turn !== "end") {
        turn = "cross";
        Sup.log("The player play now!");
      }
    }
  }
}
Sup.registerBehavior(PlayerBehavior);

