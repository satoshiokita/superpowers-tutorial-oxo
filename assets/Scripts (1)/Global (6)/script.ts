const SQUARES = new Array();

// It is an Array of arrays, each array is a victory line
// and give the three index position of each square to get the be vectorious.
const VICTORIES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

var ray = new Sup.Math.Ray();
// Initialize globally the turn variable
var turn:string;


namespace Game {
  export function setSquares() {
    function addSquare(index) {
      let name = "Square" + index.toString();
      let square:Sup.Actor = Sup.getActor("Board").getChild(name);
      SQUARES.push([square, "unHover"]);
    }
    
    for (let i = 0; i < 9; i++) {
      addSquare(i);
    }
  }
  /**
   * hecking the board SQUARES
   */
  function checkBoard() {
    let win;
    let block;
    
    for(let line of VICTORIES) {
      let crossCount:number = 0;
      let circleCount:number = 0;
      let freeSquare;
      // get a current line status.
      for (let index of line) {
        /*
        Check the situation of square from index
        - if there is a cross, increment crossCount
        - if there is a circle, increment circleCount
        - else we keep track of  it as a free square
        */
        if (SQUARES[index][1] == "cross") {
          crossCount++;
        } else if (SQUARES[index][1] == "circle") {
          circleCount++;
        } else {
          freeSquare = SQUARES[index];
        }
      }
      
      // Check is there if a winning line for computer.
      if (circleCount == 2 && crossCount == 0) { // and has freeSquare.
        win = ["Win", freeSquare];
      }
      // Check is there is a winning line for player.
      if (crossCount == 2 && circleCount == 0) {
        block = ["Block", freeSquare];
      }
    }
    
    // Return datas by order of priority
    if (win) {
      return win;
    } else if (block) {
      return block;
    }
    return ["Play", undefined];
  }
  
  export function computerTurn() {
    // Call the function checkBoard which return [Action, Array]
    let check = checkBoard();
    
    /*
    The computer follow the conditions as follow :
    - if the situation is Win, then play the freeSquare
    - else if the situation is Block, then play the freeSquare
    - else if the situation is Play, then we enter to a new branch of conditions :
     - if the center is free, then take it
     - else if one corner is free, then take it
     - else if one side is free, then take it
     - else, the game is finished
    */
    
    if (check[0] == "Win") {
      Sup.log("I play to win.");
      playSquare(check[1]);
    } else if (check[0] == "Block") {
      Sup.log("I play to block.");
      playSquare(check[1]);
    } else if (check[0] == "Play") {
      if (SQUARES[4][1] !== "cross" && SQUARES[4][1] !== "circle") {
        // if the center is free.
        Sup.log("I play the center.");
        playSquare(SQUARES[4]);
      } else if ((SQUARES[0][1] !== "cross" && SQUARES[0][1] !== "circle") ||
                 (SQUARES[2][1] !== "cross" && SQUARES[2][1] !== "circle") ||
                 (SQUARES[6][1] !== "cross" && SQUARES[6][1] !== "circle") ||
                 (SQUARES[8][1] !== "cross" && SQUARES[8][1] !== "circle")) {
        // there is free corner.
        Sup.log("I play a corner.");
        playSquare(getSquare([0, 2, 6, 8]));
      } else if ((SQUARES[1][1] !== "cross" && SQUARES[1][1] !== "circle") ||
                 (SQUARES[3][1] !== "cross" && SQUARES[3][1] !== "circle") ||
                 (SQUARES[5][1] !== "cross" && SQUARES[5][1] !== "circle") ||        
                 (SQUARES[7][1] !== "cross" && SQUARES[87][1] !== "circle")) {
        // there is free side.
        Sup.log("I play a side.");
        playSquare(getSquare([1, 3, 5, 7]));
      } else {
        Sup.log("The game is finished.");
      }
      // end of computer turn, chenage to player turn
      turn = "cross";
    }
  }
  
  // return a square that is free to play.
  function getSquare(array) {
    let freeSquares = new Array;
    
    /*
    Loop that check the array index in SQUARES
    and if the square is fre to take, add it to the array freeSquares.
    */
    for (let index of array) {
      if (SQUARES[index][1] !== "cross" && SQUARES[index][1] !== "circle") { // if there is free square.
        freeSquares.push(SQUARES[index]);
      }
    }
    
    // then take randomly one the square from freeSquares and return it.
    let randomIndex = Math.floor(Math.random() * freeSquares.length);
    return freeSquares[randomIndex];
  }
  
  function playSquare(square) {
    // apply change on the actor and change the situation to circle.
    let actor:Sup.Actor = square[0];
    actor.spriteRenderer.setAnimation("circle");
    square[1] = "circle";
  }
  
  // check victory and if situation is ended, then display end-screen.
  export function checkVictory() {
    /*
    We loop through the victory lines to check this condisitons for each square:
    - if the square is hoveredd by a cross, increment countCross
    - else if the square is hovered by a circle, increment countCircle
    - else, count it a free square in the countFreeSquares variable
    
    For each line checked, we then look for this conditions :
    - if there is 3 cross counted, then player won
    - if there is 3 circle counted, then computer won
    
    At the end of the loop, if countFreeSquare is still 0 and no victory is announced, 
    then it is a tie.
    */
    let countFreeSquare = 0;
    
    for (let line of VICTORIES) {
      let countCross = 0;
      let countCircle = 0;
      for (let index of line) {
        if (SQUARES[index][1] == "cross") {
          countCross++;
        } else if (SQUARES[index][1] == "circle") {
          countCircle++;
        } else {
          countFreeSquare++
        }
      }
      
      if (countCross == 3) {
        Sup.log("Player won!");
        displayScreen();
      } else if (countCircle == 3) {
        Sup.log("Computer won!");
        displayScreen();
      }
    }
    // end of loop
    if (countFreeSquare == 0) {
      Sup.log("It si a tie!");
      turn = "tie"; // we give the value 'tie' to the turn variable for the function displayScreen()
      displayScreen();
    }
  }
  
  function displayScreen() {
    let actor:Sup.Actor = Sup.getActor("Screen");
    actor.spriteRenderer.setAnimation(turn);
    
    /*
    // Create a new Screen actor.
    let screen = new Sup.Actor("Screen");
    // Create a new SpriteRenderer and attach it to the Screen Actor
    new Sup.SpriteRenderer(screen, "Sprites/Screens");
    // Set the frame of the sprite to the current turn, cross, cirle or tie
    screen.spriteRenderer.setAnimation(turn);
    // Attach the behavior ScreenBehavior the screen Actor
    screen.addBehavior(ScreenBehavior);
    // Set the frame position to the center (0, 0) and -2 on z axis to fit in the camera view
    screen.setPosition(0, 0, -2);
    */
    // stop the game turns
    turn = "end";
    
    function displayFrame() {
      // Set the frame position to the center (0, 0) and 4 on z axis to be in front of the board background.
      //screen.setPosition(0, 0, 4);
      //actor.setPosition(0, 0, 4);
      actor.setVisible(true);
    }
    Sup.setTimeout(1000, displayFrame);
  }
  
  export function startGame() {
    // loop through all the square of the game and set them to default.
    for (let square of SQUARES) {
      (<Sup.Actor>square[0]).spriteRenderer.setAnimation("unHover");
      square[1] = "unHover";
    }
    
    randomStart();
  }
  
  function randomStart() {
    // Call a random number between 0 and 1 to see if we stat with computer
    if (Math.floor(Math.random() * 2)) {
      let randomIndex = Math.floor(Math.random() * 9);
      playSquare(SQUARES[randomIndex]);
    }
    
    // then git back control to player
    turn = "cross";
  }
}
