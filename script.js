/*
The code I have already written in this script handles the random generation of the bug objects that 
will be the "backend" of each DOM element that will be displayed on the page.
*/

//This is the library that holds all the words that will be choosed at random with each generation of a bug object.
const words_library = ["frontend", "backend", "debug", "abstraction", "optimize", "404", "stack", "heap", "object", "algorithm", "software", "computation", "api", "library", "script", "ux", "template", "animation", "authentication", "code", "data", "interface", "function", "variable", "wireframe", "git", "database", "list", "operator"];
let max_length = 0;
let biggest = "";
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
    constructor(word) {
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
        const bugElements = document.querySelectorAll(".bug");
        for (const bugElement of bugElements) {
            if (bugElement.textContent === this.word) {
                //Removs the bug element from the DOM 
                bugElement.remove();
            }
        }
    }
    //=========================================================================================================


    // this function should call `deleteBugFromDOM()` we're nesting these to collect all the processes into one function
    // this function should also call `clearTimeout(healthProcessID)` to clear the timer that will subtract health
    // NEEDS TO BE USED INSIDE OF THE matchWord function once the function has matched the input with objects that exist
    deleteBug() {
        this.deleteBugFromDOM;
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
let player_health = 50;
//============================================ NEEDS TO BE WRITTEN ============================================
function removeHealth(length, word) {
    player_health -= (length + 1);

    if (word in bug_map) {
        //console.log(bug_map[word]);
        //console.log(player_health);
        delete bug_map[word][0];
        delete_first = bug_map[word].shift();
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
    if (spawn_interval.interval < 3) {
        //console.log("<3")
        //console.log(spawn_interval.interval);
        spawn_interval.interval -= 0.33;
        //console.log(spawn_interval.interval);

    } else {
        //console.log(">3");
        //console.log(spawn_interval.interval);
        spawn_interval.interval -= 0.5;
        //console.log(spawn_interval.interval);
    }
}

setInterval(() => { level_iterator(level_counter, spawn_interval) }, 30000);

function generateBug() {
    //console.log(spawn_interval);
    let word = words_library[getRandomInt(words_library.length)];
    let bug = new Bug(word);

    if (word in bug_map) {
        let bug_array = bug_map[word];
        bug_array.push(bug);
        bug_map[word] = bug_array;
        console.log(word);
        //console.log("Existing");
    } else {
        bug_map[word] = [bug];
        console.log(word);
        //console.log("New");
    }
    // generateBug();
    setTimeout(generateBug, spawn_interval.interval * 1000);
}

setTimeout(generateBug, spawn_interval.interval * 1000);

//setInterval(generateBug, 5000/*spawn_interval * 1000*/);

document.addEventListener("keyup", function (event) {
    var input = document.getElementById(".typingbox");
    var val = input.value.trim();

    if (killBug(val)) {
        input.value = "";
        //console.log("cleared");
        //console.log(Object.keys(bug_map))
    }

});

// setInterval(() => {
//     console.log(Object.keys(bug_map))
//     //killBug("frontend");
//     //console.log(Object.keys(bug_map))
//     console.log("------------------");
// }, 5000)