# IBMi_Password_Generator
Code for generating a "random" IBMi Password. Originally a function mixed in with a load of others in one of my sandpits, this repository strips it out to standalone.

**Important note:** we're using math.random() to generate a lot of the random numbers.
Technically speaking this isn't a cryptographically secure method, but it does the job for demo/personal use.
See more details here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

Once running the screen will be available on https://youripaddress:3005/passgen