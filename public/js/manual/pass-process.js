// Define various acceptable characters up here for later use
const lowercharacters = "abcdefghijklmnoprstuvwz";
const numbercharacters = "0123456789";
const uppercharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const specialIBMcharacters = "@£#_";
const specialgencharacters = "@£#_!'?$%^&*()[]{}";

function genpass(){
    // Get Max & Min lengths, reset other variables
    var PassMaxLength = document.getElementById("lengthmax").value;
    var PassMinLength = document.getElementById("lengthmin").value;
    var RandomMaxLength = 0;
    var Counter = 0;
    var password = "";
    var singlechar = "";
    var prevchar = "";
    var validchars = "";
    var restrictedchars = "";
    var blocknum = false;
    var MaxChar = 0;
    var PerChar = 0;
    var NumbChar = 0;
    //var stopnow = false;
    var gotnumb = false;
    var getnumb = false;
    var picked = false;

    // Debugging - show each character along the way
    //var resultstext = "";

    // If no maximum length given - use minimum length * 2

    if (PassMaxLength == 0 && PassMinLength != 0) {
        PassMaxLength = PassMinLength * 2;
    }

    // Generate random number between Max and Min
    if (PassMinLength != PassMaxLength) {
        do {
            RandomMaxLength = Math.floor((Math.random() * PassMaxLength) + 1 );
        }
        while (RandomMaxLength < PassMinLength);
        PassMaxLength = RandomMaxLength;
    }

    // If mandatory digit selected - pick a place that it can go (if we don't roll another)
    // firstchar is not ticked - means we can put the digit in position 1 if needed
    if (document.getElementById("MandDig").checked == true && 
    document.getElementById("firstchar").checked != true) {
        NumbChar = Math.floor((Math.random() * PassMaxLength) + 1); 
    }

    // firstchar is ticked - means we can't put the digit in position 1
    if (document.getElementById("MandDig").checked == true && 
    document.getElementById("firstchar").checked == true) {
        do {
            NumbChar = Math.floor((Math.random() * PassMaxLength) + 1);
        }
        while (NumbChar == 1);
    }

    // Pick a character
    var Character = function(prevchar,callback) {
        // Set digit to blank - help figure out if we've chosen one later
        digit = "";
        singlechar = "";
        picked = false;

        // If first character must be a letter check it before returning it
        if (document.getElementById("firstchar").checked == true && Counter == 1)
        { 
            do {
                digit = Math.floor(Math.random() * (MaxChar - 1 + 1) );
                // Handle special characters that could cause problems
               singlechar = parsechar(validchars[digit]);
            }
            while(uppercharacters.search(singlechar) == -1 
            && lowercharacters.search(singlechar) == -1 )
            picked = true;
        }

        // If this is the spot for a digit and we've not had one yet, make sure we get one
        if ((gotnumb == false && getnumb == true) && 
        (numbercharacters.search(singlechar) == -1 || digit == "")) {
            do {
                digit = Math.floor(Math.random() * (MaxChar - 1 + 1) );
                // Handle special characters that could cause problems
                singlechar = parsechar(validchars[digit]);
            }
            while(numbercharacters.search(singlechar) == -1 )
            picked = true;
        }

        // Limit adjacent digits - check previous digit wasn't a number
        if (blocknum == true && (digit == "" || digit != "" 
        && numbercharacters.search(singlechar) != -1) )
        {
            do {
                digit = Math.floor(Math.random() * (MaxChar - 1 + 1) );
                // Handle special characters that could cause problems
                singlechar = parsechar(validchars[digit]);
            }
            while(numbercharacters.search(singlechar) != -1 )
            picked = true;
        }


        // Limit adjacent characters - check previous digit wasn't this one
        if ( (digit == ""  || singlechar == prevchar )
        && document.getElementById("LimitAjcC").checked == true && prevchar != "" )
        {
            do {
                digit = Math.floor(Math.random() * (MaxChar - 1 + 1) );
                // Handle special characters that could cause problems
                singlechar = parsechar(validchars[digit]);
            }
            while(singlechar == prevchar )
            picked = true;
        }

        // Otherwise return whatever digit
        if (digit == "" && picked == false) {
                digit = Math.floor(Math.random() * (MaxChar - 1 + 1) );
        }
        return callback(digit)
    }

    // Figure out which character value we're using
    var textchars = document.getElementsByName("casechar");
    var casechars;
    for (var i = 0; i < textchars.length; i++ ) {
        if (textchars[i].checked) {
            casechars = textchars[i].value;
        }
    }

    // Now we know which one we're using add the relevant characters to valid
    switch (casechars) {
        case 'mixed':
            validchars += lowercharacters;
            validchars += uppercharacters;
            break;
        case 'upper':
            validchars += uppercharacters;
            break;
        case 'lower':
            validchars += lowercharacters;
            break;
    }

    // Are we including numeric characters?
    if (document.getElementById("numbers").checked == true) {
        validchars += numbercharacters;
    }
    // Not allowing numeric - turn off LimitAjc if ticked
    else {
        document.getElementById("LimitAjc").checked = false;
    }

    // Figure out which special characters we're using
    var textchars = document.getElementsByName("special");
    var casechars;
    for (var i = 0; i < textchars.length; i++ ) {
        if (textchars[i].checked) {
            casechars = textchars[i].value;
        }
    }

    // Now we know which one we're using add the relevant characters to valid
    switch (casechars) {
        case 'IBMi':
            validchars += specialIBMcharacters;
            break;
        case 'general':
            validchars += specialgencharacters;
            break;
    }

    // Have we been told to use just numbers, but also not to have them side by side?
    // Do this before processing restricted characters otherwise validchars might not == numbercharacters
    if (validchars == numbercharacters && document.getElementById("LimitAjc").checked == true) {
        document.getElementById("results").value = "Error: Numbers only but can't be adjacent";
        return;
    }

/*     if (document.getElementById("MandDig").checked == true && document.getElementById("numbers").checked != true) {
        document.getElementById("results").value = "Error: Digit required but numeric not selected";
        return;
    } */
    
    // Are we restricting any characters?
    if (document.getElementById("restricted").value != "") {
        restrictedchars = document.getElementById("restricted").value
        for (Counter=0; Counter < restrictedchars.length; Counter++) {
            validchars = validchars.replace(restrictedchars[Counter],'');
        }
        Counter=0;
    }

    // Have you asked for more characters than we can generate with "no repeats" rule?
    if (document.getElementById("NoRep").checked == true && validchars.length < PassMaxLength) {
        document.getElementById("results").value = "Error: Not enough valid chars for no repeat";
        return;
    }

    // Have you selected anything?
    if (validchars == "") {
        document.getElementById("results").value = "Error: No valid characters";
        return;
    }

    // Now determine maximum number of characters
    MaxChar = validchars.length;
    prevchar = "";

    // Loop until we hit maxlength, or minlength and RNG says stop
    do {
        Counter ++;
        //stopnow = false;

        // Alternate random length calc - 10% chance to stop here if > MinLength
        /* var RNG = Math.random();

        // If we're past min length then 10% chance to stop here
        if (Counter > PassMinLength && RNG <= 0.1)
        {
            stopnow = true;
        } */

        // Mandatory digit - if we've now chosen one yet can we have one now please
        if (NumbChar == Counter && 
        document.getElementById("MandDig").checked == true &&
        gotnumb == false) {
            getnumb = true;
        }

        Character(prevchar,function(digit){
            // Debugging - output info on each step
            //resultstext += "Digit: " + Counter + ", value: " + digit + ", Character: " + validchars[digit] + "\n";
            password += validchars[digit];
        });
        
        // If we've been given a number and we don't want adjacent numbers, not a number next please

        singlechar = parsechar(password[Counter - 1]);
        prevchar = singlechar;
        blocknum = false;
        if (numbercharacters.search(singlechar) != -1 && 
        document.getElementById("LimitAjc").checked == true)
        {
            blocknum = true;
        }

        // If we need at least one number then does this tick a box?
        if (numbercharacters.search(singlechar) != -1 && 
        document.getElementById("MandDig").checked == true && 
        gotnumb != true)
        {
            gotnumb = true;
        }

        // If we've been told no repeat characters then remove the one we just picked from the pool
        if (document.getElementById("NoRep").checked == true) {
            validchars = validchars.replace(password[Counter - 1],'');
            // Now revalidate MaxChar as a result
            MaxChar = validchars.length;
        }
    }
    //while (Counter < PassMaxLength && stopnow != true);
    while (Counter < PassMaxLength);

    // Debugging - output info on steps before password
    //document.getElementById("results").value = resultstext + "\n" + "Final password: " + password;
    document.getElementById("results").value = "Final password: " + "\n" + password;
}

// Function to feed character through both encodeURI and super EncodeURI

function parsechar(procchar) {
    var singlechar = encodeURI(procchar);
    singlechar = superEncodeURI(singlechar);
    return singlechar;
}

// If limit adjacent digits now checked then make sure numeric is too

function checknum(){
    if (document.getElementById("LimitAjc").checked == true || document.getElementById("MandDig").checked == true) {
        document.getElementById("numbers").checked = true;
        document.getElementById("numbers").disabled = true;
    }
    else {
        document.getElementById("numbers").disabled = false;
    }
}

// If no letters ticked then untick start with letter

function checkstart(){
    var textchars = document.getElementsByName("casechar");
    var casechars;
    for (var i = 0; i < textchars.length; i++ ) {
        if (textchars[i].checked) {
            casechars = textchars[i].value;
        }
    }
    if (casechars == 'none') {
        document.getElementById("firstchar").checked = false;
        document.getElementById("firstchar").disabled = true;
    }
    else {
        document.getElementById("firstchar").disabled = false;
    }
}