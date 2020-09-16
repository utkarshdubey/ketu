const fs = require('fs');
const crypto = require('crypto');

/* 
========================PACK BIT====================================
*/

// Sets the LSB to 1 or 0 depending on the bit.

/**
 * @param  {} pix
 * @param  {} pos
 * @param  {} b
 */

const pB = function (pix, pos, b) {

    let color;

    // Breaking in the constituent RGB values
    switch (pos % 3) {
      case 0:
        color = 'r';
        break;
      case 1:
        color = 'g';
        break;
      case 2:
        color = 'b';
        break;
    }
  
    if (b) {
      pix[color] |= 1;
    } else {
      pix[color] &= ~1;
    }
  
    return pix;
  
  };


/* 
========================UNPACK BIT====================================
*/

// Reads the LSB of the pixel and appends them to the corresponding position of the byte being constructed.

/**
 * Unpacks Bit
 * @param  {} b
 * @param  {} pix
 * @param  {} pos
 */

const uB = (b, pix, pos) => {
    let color;
    
    // Breaking in the constituent RGB values
    switch (pos % 3) {
        case 0:
            color = 'r';
            break;
        case 1:
            color = 'g';
            break;
        case 2:
            color = 'b';
            break;

    }

    // If the Pixel has already been set
    if(pix[color] & 1){
        b |= 1 << (7 - pos);    
    }

    return b;
};




