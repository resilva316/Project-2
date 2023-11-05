/*
The code I have already written in this script handles the random generation of the bug objects that 
will be the "backend" of each DOM element that will be displayed on the page.
*/

//This is the library that holds all the words that will be choosed at random with each generation of a bug object.
const words_library = ["frontend", "backend", "debug", "abstraction", "optimize", "404", "stack", "heap", "object", "algorithm", "software", "computation", "api", "library", "script", "ux", "template", "animation", "authentication", "code", "data", "interface", "function", "variable", "wireframe", "git", "database", "list", "operator", "remake", "react", "buffer", "functional programming", "object oriented programming", "object", "class", "ai", "machine learning", "neural network", "kernel", "operating system", "data science", "pointer", "stream", "ide", "data structure", "tree", "package", "server", "client", "github"];
let max_length = 0;
let biggest = "";
let bug_counter = 0;

let total_health = 50;
let player_health = total_health;

var level_iterator_process_id = 0;
var generate_bug_process_id = 0;
// for (let word of words_library) {                            
//     if (word.length > max_length) {                          
//         max_length = word.length;
//         biggest = word;                                
//     }
// }
// console.log(max_length);
// console.log(biggest);

//We will be holding all of the bug objects that will be generated in this map which will hold {key : value} pairs,
//the key will be the word associated with the bug object, and the value is an array holding any instances of objects with that same word
let bug_map = {};

//This is a function that just helps with randomly choosing a words for our objects, can ignore this it doesn't need more work
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


//==============================================================================================================
//This is the class that dictates the bug objects we are generating
class Bug {
    // this constructor should also call addBugToDOM
    constructor(word, id) {
        // this constructor as of right now has these 4 things:
        // 1: this.word =  word; represents the object being given a randomly generated word and setting it as its own word data
        // 2: this.time = this is the associated timer related to how long the bug will take to get to the endzone, this should affect the CSS animation
        //                timeframe as well as the timer for the removeHealth function that substracts from the global health variable
        // 3: this.health_process_id = this is the data variable that stores the value needed to CANCEL the setTimeout() once the timer has begun with
        //                             object generation, meaning this should be used along with the clearTimeout() function in the deleteBug() function
        //                             written in this class to delete the objects as well as their timers that are ticking down to remove health when the
        //                             typed input matches the objects word
        // 4: this.addBugToDom() = this is simply the constructor calling the addBugToDOM() member function immediately upon being created, this is because
        //                         we want the graphical element in the DOM to be spawned at the same time as the object in the script 
        this.id = id;
        this.word = word;
        this.time = word.length;
        this.health_process_id = setTimeout(() => { removeHealth(this.word.length, this.word) }, (this.time * 1000));
        this.addBugToDOM();
    }

    //This function should handle actually adding the DOM graphical element to the HTML side
    //======================================= NEEDS TO BE WRITTEN =============================================
    addBugToDOM() {
        //create a new bug element as a <div>
        const bugElement = document.createElement("div");
        bugElement.classList.add("bug");
        bugElement.id = "bug-" + this.id;
        bugElement.textContent = this.word; //sets the word associated with the bug

        bugElement.style.position = "absolute";
        const gameContainer = document.querySelector(".game-container");

        const containerWidth = 1000; // Width of the container
        const containerHeight = 440; // Height of the container
        const bugWidth = bugElement.offsetWidth;
        const bugHeight = bugElement.offsetHeight;

        // Calculate random positions within the dimensions
        const randomTop = Math.random() * (containerHeight - bugHeight) + "px";
        const randomLeft = Math.random() * (containerWidth - bugWidth) + "px";

        bugElement.style.top = randomTop;
        bugElement.style.left = randomLeft;

        //Append the bug element to the game container
        gameContainer.appendChild(bugElement);
    }
    //=========================================================================================================

    //This function should handle deleting the DOM grpahical element of an object from the HTML side, needs to be used inside the deleteBug function
    //======================================= NEEDS TO BE WRITTEN =============================================
    deleteBugFromDOM() {
        //Find the bug element by its associated word
        const bugElement = document.querySelector(`#bug-${this.id}`);
        bugElement.remove();
    }
    //=========================================================================================================


    // this function should call `deleteBugFromDOM()` we're nesting these to collect all the processes into one function
    // this function should also call `clearTimeout(healthProcessID)` to clear the timer that will subtract health
    // NEEDS TO BE USED INSIDE OF THE matchWord function once the function has matched the input with objects that exist
    deleteBug() {
        this.deleteBugFromDOM();
        clearTimeout(this.health_process_id);
    }

}

// function generateBug() {

//     let word = words_library[getRandomInt(words_library.length)];
//     let bug = new Bug(word);

//     if (word in bug_map) {
//         let bug_array = bug_map[word];
//         bug_array.push(bug);
//         bug_map[word] = bug_array;
//         console.log(word);
//         //console.log("Existing");
//     } else {
//         bug_map[word] = [bug];
//         console.log(word);
//         //console.log("New");
//     }

// }

//This function should be able to match the words from the user input field to existing objects with the same word and delete them
function killBug(word) {
    if (word in bug_map) {
        for (let bug of bug_map[word]) {
            bug.deleteBug();
        }
        delete bug_map[word];
        return true;
    }

}

//Function that will remove health from the global health bar variable
//============================================ NEEDS TO BE WRITTEN ============================================
function removeHealth(length, word) {
    player_health -= (length + 1);
    if (player_health <= 0) {
        player_health = 0;
        end_game();
    }

    // Updates health bar
    let health_bar = document.querySelector(".health");
    health_bar.style.width = `${100 * player_health / total_health}%`;
    //console.log(player_health);
    //console.log(`${player_health / total_health}%`);

    if (word in bug_map) {
        //console.log(bug_map[word]);
        //console.log(player_health);
        bug_map[word][0].deleteBug(word);
        delete bug_map[word][0];
        delete_first = bug_map[word].shift();

        if (bug_map[word].length == 0) {
            delete bug_map[word]
        }

        //console.log(bug_map[word]);

    }
}

var level_counter = {
    counter: 1
}
var spawn_interval = {
    interval: 4
};

function level_iterator(level_counter, spawn_interval) {
    level_counter.counter += 1;
    if (spawn_interval.interval > 3) {
        //console.log("<3")
        //console.log(spawn_interval.interval);
        spawn_interval.interval -= 0.5;
        //console.log(spawn_interval.interval);
        console.log("first if: " + spawn_interval.interval)

    } else if (spawn_interval.interval > 1.5 && spawn_interval.interval <= 3) {
        //console.log(">3");
        //console.log(spawn_interval.interval);
        spawn_interval.interval -= 0.33;
        console.log(spawn_interval.interval);
    }

    if (spawn_interval.interval < 1.5) spawn_interval.interval = 1.5;

    let level_counter_elem = document.querySelector("#level-counter");
    level_counter_elem.innerHTML = `Level ${level_counter.counter}`;
}

function generateBug() {
    //console.log(spawn_interval);
    let word = words_library[getRandomInt(words_library.length)];
    let bug = new Bug(word, bug_counter);
    bug_counter++;

    if (word in bug_map) {
        let bug_array = bug_map[word];
        bug_array.push(bug);
        bug_map[word] = bug_array;
        //console.log(word);
        //console.log("Existing");
    } else {
        bug_map[word] = [bug];
        //console.log(word);
        //console.log("New");
    }
    // generateBug();
    generate_bug_process_id = setTimeout(generateBug, spawn_interval.interval * 1000);
}

let isPaused = false;

function togglePause() {
    isPaused = !isPaused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';
}

function pauseGame() {
    document.getElementById('typingbox').disabled = true;
    // If you have a game loop interval or animation frame request, cancel it here
    // clearInterval(gameLoopInterval); or cancelAnimationFrame(requestId);
}

function resumeGame() {
    document.getElementById('typingbox').disabled = false;
    // Restart your game loop interval or animation frame request here
    // gameLoopInterval = setInterval(gameLoop, 1000 / 60); or requestId = requestAnimationFrame(gameLoop);
}

// setInterval(() => {
//     console.log(Object.keys(bug_map))
//     //killBug("frontend");
//     //console.log(Object.keys(bug_map))
//     console.log("------------------");
// }, 5000)

function start_game() {

    let start_popup = document.querySelector(".start-popup");
    start_popup.style.display = "none";

    level_iterator_process_id = setInterval(() => { level_iterator(level_counter, spawn_interval) }, 30000);
    generate_bug_process_id = setTimeout(generateBug, spawn_interval.interval * 1000);

    //setInterval(generateBug, 5000/*spawn_interval * 1000*/);

    document.addEventListener("keyup", function (event) {
        var input = document.getElementById("typingbox");
        var val = input.value.trim();

        if (killBug(val)) {
            input.value = "";
            //console.log("cleared");
            //console.log(Object.keys(bug_map))
        }

    });

}

function end_game() {

    let end_popup = document.querySelector(".end-popup");
    let end_popup_text = document.querySelector("#end-popup-text");
    end_popup_text.innerHTML = `Nice try! You made it all the way to level: ${level_counter.counter}`;
    end_popup.style.display = "flex";

    // kill all the bugs in bug_map
    for (let word in bug_map) {
        for (let bug of bug_map[word]) {
            bug.deleteBug();
        }
        delete bug_map[word];
    }


    clearTimeout(generate_bug_process_id);
    clearInterval(level_iterator_process_id);

}