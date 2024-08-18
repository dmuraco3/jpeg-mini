import enc from "../src";
import {decode, encode} from "jpeg-js";
import fs from "fs";

const jpegData = fs.readFileSync("lena.jpg");
const rawImageData = decode(jpegData);
console.log(rawImageData);

const image = enc(rawImageData, 100);
const img = encode(rawImageData, 100);

console.log(image.data.toString("base64"));