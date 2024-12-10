/**
 * 9Luck
 * Kiana Rezaee
 * 
 * You will die regardless of what you do, but is there larger meaning in this death?
 * In you?
 * In your surroundings?
 * Play to find out how it all ends..
 * 
 * Instructions:
 * - Black Cat will be following your mouse
 * - Catch lucky items to survive longer 
 * - If you catch unlucky items, you will lose your 9 lucky hearts
 * - If you do not catch them they will collide with the wall and make you lose lives anyways...
 * - random rewards will be given to you throughout your play
 * - act quickly and see how long you last!
 *
 *
 * Made with p5
 * https://p5js.org/
 */


// Setting up the black cat charecter as a variable so it can change throughout the game
let BlackCat = {
    //the body is separate to the paw as it is a drawing
    body: {
        x: 320,
        y: 520,
        size: 50,
        image: undefined
    },
    //the paw is what interacts with the different symbols in the game
    paw: {
        x: 0,
        y: 480,
        
        //this is the main arm, it is a rectangle 
        rect: {
            width: 40,
            height: 900,
        },
        //this is the round hand its a circle
        hand: {
            size: 40,
        },
        //this is the thumb it is a smaller circle
        thumb: {
            size: 15,
        },
        speed: 20,
    } 
};

//setting up the pixel font variable that i will use for the game hopefully
let pixelFont;

//music is undefined at the start before being loaded 
let music = undefined;

//ending messages are undefined at first
let deathMessage = undefined;

//same with reward messages
let rewardMessage = undefined; 

// My objects which the black cat interacts with are located in the json file where they are in an array 
//they each have an image, position, size, and speed
let gameObjects = [];


//timer 
let timer ={
    counter: 0,
}

//the ace of hearts and its counter
let ace = { 
    //image of an ace heart 
    counter: 9,
    image: undefined,
    x: 580, 
    y: 20,
    size: 50,
};

//I use this for the movement of symhols function in sine
// some credits to dio: https://editor.p5js.org/dio/sketches/FACyzYY0s
let angle= 0;


// my attempt at an array
// these are potential end messages which are randomly displayed 
// they correspond with the luckiness of each symbol to give viewers some hints
const endMessages = [
    "BlackCat Says: Your itchy foot foresaw your violent death...\nyou were attacked in the back of an alleyway.",
    "BlackCat Says: You stuck your chopsticks in rice inviting an early death... \nyou choked on your food and perished.",
    "BlackCat Says: How many mirrors can a person break...\n a piano fell on your head on the way to your mirror-breaking job.",
    "BlackCat Says: Upside-down horseshoe...\n your trip to the petting zoo ended in tragedy.",
    "BlackCat Says: The wise owl foresaw illness...\n for who? but of course you...",
    "BlackCat Says: The ladybug ensured you\n saw guests in your final moments!",
    "BlackCat Says: Your childhood goldfish brought you material abundance\n before your passing, lucky you!",
    "BlackCat Says: How did you find so many four-leaf clovers…\n what a life you lived!",
    "BlackCat Says: Horse shoes were always the right side up for you;\n you were protected from angry fauna till the very end!",
    "BlackCat Says: The wheel ensured your fortune and joy;\n what an adventurous life!"
];

//the random rewards will give one of these messages and do the following
const rewardMessages = [
  { message: "Nineteen extra hearts for you, a fortunate reward by the Gods!", aceCounter: 19 },
  { message: "Nineteen extra hearts… how long will this misery go on!", aceCounter: 19 },
  { message: "You get another chance to experience the thrill of beginning! Restart with 9 hearts.", aceCounter: 9 },
  { message: "The gods have forsaken you. Restart with 9 lives!", aceCounter: 9 },
  { message: "Mother Earth has taken mercy on you and ended your pain early! You lose all your hearts.", aceCounter: 1 },
  { message: "You could have had so many experiences… all your lives are unexpectedly taken from you.", aceCounter: 1 },
  { message: "Smoke signals! All items have been declared lucky.", gameObjectsLucky: true },
  { message: "The grander scheme of things... why is everything so small?", gameObjectsSize: 50 },
  { message: "Enlightenment! Your epiphany changes the tempo of the game. Are you faster or are the omens slower?", gameObjectsSpeed: 2 },
];


// Game state is a variable that can change and it begins with the "start"
let gameState = "start"; 
// Variable for cat bounce effect
let bounceY = 0; 
// Direction of the bounce so it looks natural 
let bounceDirection = 1; 

// Preloads all the images and music
function preload() {
    // Load the JSON file and assign the result to 'gameData'
    // unfortunately i think this is the overall issue, my friend says that it has to do with p5's asynchronous loading
    gameData = loadJSON("https://github.com/DUZAKH/RandomLuck/blob/831f97498f9c87b77dc4044ec5b84bfaabf5f837/js/gameObjects.json");
    //the image of the heart
    ace.image = loadImage("https://duzakh.github.io/cart253/mod-jam/assets/images/aceofhearts.PNG");
    //black cat's image
    BlackCat.body.image = loadImage("https://duzakh.github.io/cart253/mod-jam/assets/images/BlackCat.png");
    //the music
    music = loadSound("https://duzakh.github.io/cart253/mod-jam/assets/sounds/music.mp3");
    // the font
    pixelFont = loadFont("https://duzakh.github.io/cart253/mod-jam/assets/Jacquard_24/Jacquard24-Regular.ttf");
    //console to check if the issue is the gamedata or not
    console.log("Game data loaded:", gameData);
}

// Canvas and background setup
function setup() {
    //function to see if its working in setup
    console.log(gameData.objects);
    // Loop through the 'objects' array in the loaded data
    gameData.objects.forEach((obj) => {
        // Create a new object with the image loaded
        let newObject = {
            ...obj,
            image: loadImage(obj.image),
        };
        //console to see if the issue is newobject loop
        console.log(newObject);
        gameObjects.push(newObject);
    });

    createCanvas(640, 480);
    background("#AEF359"); // bright green
}

//draw function and general game if statements 
function draw() {
    // Background is in every frame so that the animation of the cat bouncing doesn't mess it up, it looked messed up at first because i didnt put this...
    background("#AEF359"); 

    if (gameState === "start") {
        // when the player starts the game, the display screen is shown this function is defined later
        displayStartScreen();
        // the bouncing cat animation function starts too, this continues throughout thte rest of the game also defined later
        animateCat(); 
    } else if (gameState === "game") {
        //moves the cat
        moveCat();
        // this makes the cat moves with the mouse
        BlackCat.body.x = mouseX;
        
        // position of the paw relative to the cat, its shifted slightly to the left
        BlackCat.paw.x = BlackCat.body.x - 40;

        // Draws the ace heart
        drawLives();

        // draws the counter
        displayCounter();

        // Draws the paw
        drawPaw();
        
        //adds to the timer
        timer.counter++;
        
        //moves all the objects whose images were described in preload
        moveSymbols();

        // draws all the objects whose images were described in preload
        drawSymbols();

        // Checks for collisions between the paw and objects
        checkCollisions();}
    else if (gameState ==="end") {
        displayDeathScreen();
        }
}

// the two functions below are to draw the ace image and counter
// Function to draw the heart icon 
function drawLives() {
    // ace heart icon 
    image(ace.image, ace.x, ace.y, ace.size, ace.size);
}

// Function to draw all game objects (symbols)
function drawSymbols() {
    gameObjects.forEach(obj => {
        image(obj.image, obj.x, obj.y, obj.size, obj.size);
    });
}

// Function to move all game objects (symbols)
function moveSymbols() {
    gameObjects.forEach(obj => {
        obj.x += obj.speedX;
        obj.y += obj.speedY;

        // Adding sine-wave motion for a dynamic effect
        obj.y += 5 * sin(angle);
        console.log(`Object ${obj.image} moved to (${obj.x}, ${obj.y})`); // Log object movement
    });

    // Increment the angle for the sine motion
    angle += 0.1;
}

// Function to reset positions of symbols when they move off-screen or collide
function resetSymbols() {
    gameObjects.forEach(obj => {
        if (obj.x < 0 || obj.x > width || obj.y > height) {
            obj.x = random(width); // Reset to a random x-position
            obj.y = -obj.size; // Reset above the screen
        }
    });
}


// Fucntion to display the text
function displayCounter() {
    textSize(24);
    textFont(pixelFont); //sets the font to the pixel one in my assets
    fill(0); // black

    // Display the counter next to the heart icon
    text(ace.counter, 
        //adds the ace x
        ace.x - ace.size + 40, 
        ace.y + ace.size / 2);
}

// function to reduce the number of lives, used later on
function decreaseLife() {
    //if the counter is more than 0 it decreases by 1
    if (ace.counter > 0) {
        ace.counter--;  }
    //if the counter is equal to zero the gameover function starts
    else if (ace.counter === 0){
        gameOver();
    }
}

//if the ace counter is at 111, 222, 333, 444, 555, or 666 a random reward message is displayed
function randomReward () {
    if (ace.counter == 111, 222, 333, 444, 555, 666)
    displayRewardmessage=random(rewardMessages);
}



// Cat bouncing
function animateCat() {
    // Updates the bounce position
    bounceY += bounceDirection * 0.5; // 0.5 is the value for speed of bounce
    // Reverse direction if it exceeds bounds
    if (bounceY > 5 || bounceY < -5) {
        bounceDirection *= -1; // Revere direction
    }
    // Draw the bouncing cat (lower position)
    image(BlackCat.body.image, width / 2 - 100, height / 2 + 50 + bounceY, 200, 200); 
}

// Cat bouncing
function moveCat() {
    // Updates the bounce position
    bounceY += bounceDirection * 0.5; // 0.5 is the value for speed of bounce

    // Reverse direction if it exceeds bounds
    if (bounceY > 5 || bounceY < -5) {
        bounceDirection *= -1; // Reverse direction
    }
    // Draw the bouncing cat (lower position)
    image(BlackCat.body.image, mouseX, height / 2 + 50 + bounceY, 200, 200); 
}

// Function to draw the paw
function drawPaw() {
    fill(0); 
    //rectangle for the outstretched arm
    rect(BlackCat.paw.x, mouseY, BlackCat.paw.rect.width, BlackCat.paw.rect.height);
    //circles for the hand and thumb
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size / 2, mouseY, BlackCat.paw.hand.size);
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size, mouseY, BlackCat.paw.thumb.size);
}

function displayStartScreen() {
    //each of the following lines is text that comes up during gameplay, they are seperated for ease of reading
    textSize(30);
    textAlign(CENTER);
    textFont(pixelFont);
    fill(0); // Black color
    text("Purrgatory! Your Existence and Mortality Exist by Chance", width / 2, height / 3);
    
    textSize(16);
    textAlign(CENTER);
    fill(0); // Black 
    text("see what rewards befall you...", width / 2, height / 2.5);
    text("your luck is being tested all the time,", width / 2, height / 2.3);
    text("everthing is chance.", width / 2, height / 2.1);
    text("In much of the ancient world, humans attempted to decode divine messages:", width / 2, height / 1.9);
    text("omens. See how long your ace of hearts can survive!", width / 2, height / 1.8);

    // Start the game
    textSize(20);
    fill(255); // Set to white
    text("Click to Start", width / 2, height / 1.3); // Position it at the bottom
}

function gameOver() {
    gameState="end";
    deathMessage = random(endMessages);
}

//main function for the ending screen 

function displayDeathScreen() {
    background("#AEF359");  
    textSize(24);
    fill(0);  
    textAlign(CENTER,CENTER);
    animateCat();
    
    // Display the death message
    text(deathMessage, width / 2, height / 2);

    //displays the seconds you played

    //floor converts the calculated number into 
    text(floor(timer.counter/60) + " seconds", 100, 50);
}

//function that displays the reward message
function displayRewardmessage(){
    textSize(24);
    text(rewardMessage, width/2, hieght/2);
    
}
// Checks for collision between the paw and symbols
function checkCollisions() {
    gameObjects.forEach(obj => {
        // Calculate the distance between the BlackCat's paw and the current object
        let distance = dist(BlackCat.paw.x, mouseY, obj.x, obj.y);

        // Check if the paw is in the range of the object
        if (distance < BlackCat.paw.hand.size + obj.size / 2) {
            // If it's a lucky symbol
            if (obj.lucky) {
                ace.counter++; // Increase lucky ace
            } else {
                ace.counter--; // Decrease lucky ace (unlucky)
            }

            // Reset the object's position
            resetSymbol(obj); // Reset item position
        }
    });
}

//puts the objects back to the start of the canvas
function resetSymbol(symbol) {
    symbol.x = -symbol.size;
    //ramdom causes the y to be decided... randomly https://p5js.org/reference/p5/random/
    symbol.y = random(0, height - symbol.size);
}

function mousePressed() {
    // checks to see if the game is on start, which it is at the beginning 
    if (gameState === "start") {
        //Changes the state to play when the mouse is pressed
        gameState = "game"; 
    }
    
    // Plays music if it's not already playing and loops it
    if (music && !music.isPlaying()) {
        music.loop();
    }
}
