import {Buffer} from 'buffer';

const Base64 = {
    encode(v: string): string {
        return Buffer.from(v).toString('base64');
    },
    decode(v: string): string {
        return Buffer.from(v, 'base64').toString();
    }
}

export {Base64}