// Helper for awaiting fames repainting
function perform_after_first_repaint(func) {
    // MDN refference to this structure
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(func)
    })
}

// Color scheme changer
function change_color_scheme() {
    document.querySelector('.app').classList.toggle('night');
}

// List of possible names
const NAMES = ["Harry", "Ross", "Bruce", "Cook",
    "Carolyn", "Morgan", "Albert", "Walker",
    "Randy", "Reed"]

// Interface to interact with history message DOM
function show_history_message(message) {
    const historyDOM = document.querySelector('.history');
    historyDOM.className = 'history';
    historyDOM.innerHTML = message;

    perform_after_first_repaint(
        () => historyDOM.className = 'history show'
    )
}

// Rendering current word on screen
function render_word(word, isLeftChar) {
    const wordDOM = document.querySelector('.word');
    
    // Removing all chars
    wordDOM.querySelectorAll('*').forEach(node => node.remove())

    // Creating char containers
    const activeCharDOM = document.createElement('span');
    const otherCharsDOM = document.createElement('span');
    activeCharDOM.className = 'char active';
    otherCharsDOM.className = 'char';

    // Set inner text to char containers
    // and append to word container in right order
    if (isLeftChar) {
        activeCharDOM.innerHTML = word.slice(0, 1);
        otherCharsDOM.innerHTML = word.slice(1);

        wordDOM.appendChild(activeCharDOM);
        wordDOM.appendChild(otherCharsDOM);
    }
    else {
        activeCharDOM.innerHTML = word.slice(-1);
        otherCharsDOM.innerHTML = word.slice(0, word.length - 1);

        wordDOM.appendChild(otherCharsDOM);
        wordDOM.appendChild(activeCharDOM);
    }
}

// Char removing from word logic
function operate_word(word, currentChar) {
    let newWord = '';

    // Put chars which are not equal to currentChar
    for (let i = 0; i < word.length; i++) {
        if (currentChar.toLowerCase() !== word[i].toLowerCase()) {
            newWord += word[i];
        }
    }
    return newWord
}

// Returns random word from list
function get_random_word() {
    return NAMES[parseInt(Math.random() * NAMES.length)];
}

// Main function
function app() {
    // Initializing variables 
    let word = get_random_word();
    let isLeftChar = true;  // Indicator of current char position
    
    render_word(word, true);

    document.addEventListener("keypress", (e) => {
        // Get active char from word
        const activeChar = word[(word.length - 1) * !isLeftChar]

        // Compare pressed key and active char (last or first char)
        if (e.key.toLowerCase() === activeChar.toLowerCase()) {

            // Message currently pressed key
            show_history_message(`Pressed ${e.key} key. It is right.`);
            
            // Update word. Remove pressed letters
            word = operate_word(word, activeChar);

            // Re-render word if characters are left. If no,
            // get new word from list and render it.
            if (word.length != 0) {
                render_word(word, isLeftChar = !isLeftChar);
            }
            else {
                word = get_random_word();
                isLeftChar = true;
                render_word(word, isLeftChar);
                show_history_message('New word generated');
            }
        }
        else {
            show_history_message(`Pressed ${e.key} key. It is wrong.`)
        }
    });

}

app();
