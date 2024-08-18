import enc from "../src";
import {decode, encode} from "jpeg-js";
import fs from "fs";
import { spawn } from "bun";

function pbcopy(data: string) {
    const proc = spawn(["pbcopy"], {stdin:"pipe"});
    proc.stdin.write((new TextEncoder()).encode(data));
    proc.stdin.flush();
    proc.stdin.end();
}

const jpegData = fs.readFileSync("lena.jpg");
const rawImageData = decode(jpegData);

const image = enc(rawImageData, 100);
const base64 = image.data.toString("base64");
// const img = encode(rawImageData, 100);

pbcopy(base64);