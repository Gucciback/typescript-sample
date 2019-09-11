import * as fs from 'fs';
import * as numeral from'numeral';

export function openFile(path) {

    return new Promise((resolve, reject) => {
        fs.readFile(path, {}, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}

export function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function memoryUsage() {
    let memory = process.memoryUsage();
    return numeral(memory.rss).format('0.00b');
}
