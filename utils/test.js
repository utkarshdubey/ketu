const steg = require('./core');

console.log(__dirname);
steg.decrypt(__dirname + '\\with_pass.png', __dirname, '123').then(res => console.log(res));