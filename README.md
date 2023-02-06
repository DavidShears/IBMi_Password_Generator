# IBMi_Password_Generator
Code for generating a "random" IBMi Password. Originally a function mixed in with a load of others in one of my sandpits, this repository strips it out to standalone.

**Important Note:** Two versions of the logic are included in pass-process.js, using math.random() and crypto.getRandomValues()

The script was originally written using math.random() however this isn't a secure method and should only be for demo/personal use. See more details here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

As of Feb 2023 the above logic was commented out and replaced with use of crypto.getRandomValues() which is a more secure approach explained here: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
Technically this is still not completely secure, as we are forcing conditions on the calculation to ensure the result is within the range of numbers that we want. At a later date will revisit this and perhaps find a cleaner method of ensuring the result is one we want, while being more secure.

Original math.random() lines are commented out but can be re-introduced if a problem is identified. Otherwise getRandom function should be used.

Once running the screen will be available on https://youripaddress:3005/passgen