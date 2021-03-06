class ScreenBehavior extends Sup.Behavior {
  /*
  When space key pressed :
   - Destroy the victory screen
   - Start a new game
  */
  awake() {
    
  }
  update() {
    if (Sup.Input.wasKeyJustPressed("SPACE")) {
      //Sup.getActor("Screen").destroy(); // destroy self.
      this.actor.setVisible(false);
      Game.startGame();
    }
  }
}
Sup.registerBehavior(ScreenBehavior);