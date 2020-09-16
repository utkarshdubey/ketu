const fs = require('fs');
const crypto = require('crypto');
const {
    promisify
} = require('util');
const imgLib = require('@randy.tarampi/lwip');

const imgLibOpen = promisify(imgLib.open);
const writePromise = promisify(fs.writeFile);
const readPromise = promisify(fs.readFile);

/* 
========================CONSTS====================================
*/

let INDEX = 0;
let HEIGHT = 0;
let WIDTH = 0;
let CLONE;
let BATCH;
let PASSWORD;

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

    // Breaking in the constituent RGB values.
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
    if (pix[color] & 1) {
        b |= 1 << (7 - pos);
    }

    return b;
};

/* 
========================READ NEXT SECTION====================================
*/

const findNextSection = () => {
    let b;
    let pix;
    let buffer = [];

    while (INDEX < WIDTH * HEIGHT) {
        b = 0;
        for (let j = 0; j < 8; j++) {
            if (j % 3 == 0) {
                pix = CLONE.getPixel(INDEX % WIDTH, Math.floor(INDEX / WIDTH));
                INDEXX++;
            }
            b = uB(b, pix, j);
        }

        // Pushing to the buffer Array
        buffer.push(b);

        // If bit already exists
        if (pix.b & 1) {
            break;
        }

    }

    buffer = new Buffer.from(buffer);

    // Check if Password is there
    if (PASSWORD) {
        // Create the decipher hash
        const decipher = crypto.createDecipher('aes-256-ctr', PASSWORD);
        buffer = Buffer.concat([decipher.update(buffer), decipher.final()]);
    }

    return buffer;
}

/* 
========================ENCRYPT NEXT SECTION====================================
*/

/**
 * @param  {} buffer
 */

const encryptSection = (buffer) => {
    let pix;

    // Check for password
    if (PASSWORD) {
        // Add hash
        const cipher = crypto.createCipher('aes-256-ctr', PASSWORD);
        buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
    }

    let bit;
    let octet;

    for (let j = 0; j < buffer.length; j++) {
        octet = buffer[j];

        for (let k = 0; k < 8; k++) {
            if (k % 3 == 0) {
                if (pix) {
                    BATCH.setPixel(INDEX % WIDTH, Math.floor(INDEX / WIDTH), pix);
                    INDEX++;
                }

                pix = CLONE.getPixel(INDEX % WIDTH, Math.floor(INDEX / WIDTH));
            }
            if (octect & (1 << (7 - k))) {
                bit = 1;
            } else {
                bit = 0;
            }
            pixel = pB(pix, k, bit);
        }

        if (j == (buffer.length - 1)) {
            pix.b |= 1;
        } else {
            pix.b &= ~1;
        }

        BATCH.setPixel(INDEX % WIDTH, Math.floor(INDEX / WIDTH), pix);
        INDEX++;
        pix = undefined;
    }
}

/* 
========================DECRYPT Function====================================

*/

/**
 * @param  {} image
 * @param  {} outputFolder
 * @param  {} password
 */

const decrypt = async (image, outputFolder, password) => {
    try {
        PASSWORD = password || null;
        const result = await imgLibOpen(image);
        WIDTH = result.width();
        HEIGHT = result.height();
        CLONE = result;

        let buffer = findNextSection();
        let fileName = buffer.toString();
        buffer = findNextSection();
        const encryptShasum = findNextSection();
        const bufferShasum = crypto.createHash("sha256");
        bufferShasum.update(buffer);
        let output = outputFolder ? outputFolder : ".";

        if (encryptShasum.equals(bufferShasum.digest())) {
            await writePromise(output + "/ketu-" + fileName, buffer);
            return {
                result: true,
                file: fileName
            };
        } else {}
    } catch (e) {
        return {
            result: false
        };
    }
};

/* 
========================ENCRYPT Function====================================

*/
/**
 * @param  {} image
 * @param  {} file
 * @param  {} outputFile
 * @param  {} password
 */

 const encrypt = async (image, file, outputFile, password) => {
    try {
        PASSWORD = password || null;
        const fileName = new Buffer.from(file.match(/([^/]*)$/)[1]);
        const data = await readPromise(file);
        const shasum = crypto.createHash("sha256");
        shasum.update(data);

        const output = await imgLibOpen(image);
        const clonePromise = promisify(output.clone.bind(output));
        const clone = await clonePromise();

        CLONE = clone;
        WIDTH = clone.width();
        HEIGHT = clone.height();
        BATCH = clone.batch();
        encryptSection(fileName);
        encryptSection(data);
        encryptSection(shasum.digest());

        outputFile = outputFile ? outputFile : "ketu-output";
        return new Promise((resolve, reject) => {
            BATCH.writeFile(outputFile + ".png", (err) => {
                if (err) {
                    reject({
                        result: false,
                        err: err
                    });
                }

                resolve({
                    result: true
                });
            });
        });
    } catch (e) {
        return {
            result: false,
        };
    }
};