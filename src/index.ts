function btoa(buf: number[]) {
    return Buffer.from(buf).toString("base64");
}

class JPEGEncoder {
    bitcode: any[];
    category: any[];
    outputfDCTQuant: any[];
    DU: any[];
    byteout: number[];
    bytenew: number;
    bytepos: number;
    YDU: number[];
    UDU: any[];
    VDU: any[];
    clt: any[];
    RGB_YUV_TABLE: any[];
    YDC_HT!: number[][];
    UVDC_HT!: number[][];
    YAC_HT!: number[][];
    UVAC_HT!: number[][];

    ZigZag: number[];
    std_dc_luminance_nrcodes: number[];
    std_dc_luminance_values: number[];
    YTable: Array<number>;
    UVTable: Array<number>;
    fdtbl_Y: Array<number>;
    fdtbl_UV: Array<number>;
    std_ac_luminance_nrcodes: number[];
    std_ac_luminance_values: number[];
    std_dc_chrominance_nrcodes: number[];
    std_dc_chrominance_values: number[];
    std_ac_chrominance_nrcodes: number[];
    std_ac_chrominance_values: number[];
    currentQuality!: number;


    constructor(qu: number) {
        this.YTable = new Array(64);
        this.UVTable = new Array(64);
        this.fdtbl_Y = new Array(64);
        this.fdtbl_UV = new Array(64);
        this.ZigZag = [
            0, 1, 5, 6, 14, 15, 27, 28,
            2, 4, 7, 13, 16, 26, 29, 42,
            3, 8, 12, 17, 25, 30, 41, 43,
            9, 11, 18, 24, 31, 40, 44, 53,
            10, 19, 23, 32, 39, 45, 52, 54,
            20, 22, 33, 38, 46, 51, 55, 60,
            21, 34, 37, 47, 50, 56, 59, 61,
            35, 36, 48, 49, 57, 58, 62, 63
        ];
        this.std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        this.std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
        this.std_ac_luminance_values = [
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
            0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
            0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
            0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
            0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
            0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
            0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
            0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
            0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
            0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
            0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
            0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
            0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
            0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
            0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
            0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];
        this.std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
        this.std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
        this.std_ac_chrominance_values = [
            0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
            0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
            0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
            0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
            0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
            0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
            0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
            0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
            0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
            0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
            0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
            0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
            0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
            0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
            0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
            0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
            0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
            0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
            0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
            0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];
        this.bitcode = new Array(65535);
        this.category = new Array(65535);
        this.outputfDCTQuant = new Array(64);
        this.DU = new Array(64);
        this.byteout = [];
        this.bytenew = 0;
        this.bytepos = 7;

        this.YDU = new Array(64);
        this.UDU = new Array(64);
        this.VDU = new Array(64);
        this.clt = new Array(256);
        this.RGB_YUV_TABLE = new Array(2048);
        
        this.initCharLookupTable();
        this.initHuffmanTbl();
        this.initCategoryNumber();
        this.initRGBYUVTable();

        this.setQuality(qu);
    }

    initQuantTables(sf: number) {
        var YQT = [
            16, 11, 10, 16, 24, 40, 51, 61,
            12, 12, 14, 19, 26, 58, 60, 55,
            14, 13, 16, 24, 40, 57, 69, 56,
            14, 17, 22, 29, 51, 87, 80, 62,
            18, 22, 37, 56, 68, 109, 103, 77,
            24, 35, 55, 64, 81, 104, 113, 92,
            49, 64, 78, 87, 103, 121, 120, 101,
            72, 92, 95, 98, 112, 100, 103, 99
        ];

        for (var i = 0; i < 64; i++) {
            var t = Math.floor((YQT[i] * sf + 50) / 100);
            if (t < 1) {
                t = 1;
            } else if (t > 255) {
                t = 255;
            }
            this.YTable[this.ZigZag[i]] = t;
        }
        var UVQT = [
            17, 18, 24, 47, 99, 99, 99, 99,
            18, 21, 26, 66, 99, 99, 99, 99,
            24, 26, 56, 99, 99, 99, 99, 99,
            47, 66, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99,
            99, 99, 99, 99, 99, 99, 99, 99
        ];
        for (var j = 0; j < 64; j++) {
            var u = Math.floor((UVQT[j] * sf + 50) / 100);
            if (u < 1) {
                u = 1;
            } else if (u > 255) {
                u = 255;
            }
            this.UVTable[this.ZigZag[j]] = u;
        }
        var aasf = [
            1.0, 1.387039845, 1.306562965, 1.175875602,
            1.0, 0.785694958, 0.541196100, 0.275899379
        ];
        var k = 0;
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                this.fdtbl_Y[k] = (1.0 / (this.YTable[this.ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                this.fdtbl_UV[k] = (1.0 / (this.UVTable[this.ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                k++;
            }
        }
    }

    computeHuffmanTbl(nrcodes: Array<number>, std_table: Array<number>) {
        var codevalue = 0;
        var pos_in_table = 0;
        var HT = new Array();
        for (var k = 1; k <= 16; k++) {
            for (var j = 1; j <= nrcodes[k]; j++) {
                HT[std_table[pos_in_table]] = [];
                HT[std_table[pos_in_table]][0] = codevalue;
                HT[std_table[pos_in_table]][1] = k;
                pos_in_table++;
                codevalue++;
            }
            codevalue *= 2;
        }
        return HT;
    }

    initHuffmanTbl() {
        this.YDC_HT = this.computeHuffmanTbl(this.std_dc_luminance_nrcodes, this.std_dc_luminance_values);
        this.UVDC_HT = this.computeHuffmanTbl(this.std_dc_chrominance_nrcodes, this.std_dc_chrominance_values);
        this.YAC_HT = this.computeHuffmanTbl(this.std_ac_luminance_nrcodes, this.std_ac_luminance_values);
        this.UVAC_HT = this.computeHuffmanTbl(this.std_ac_chrominance_nrcodes, this.std_ac_chrominance_values);
    }

    initCategoryNumber() {
        var nrlower = 1;
        var nrupper = 2;
        for (var cat = 1; cat <= 15; cat++) {
            //Positive numbers
            for (var nr = nrlower; nr < nrupper; nr++) {
                this.category[32767 + nr] = cat;
                this.bitcode[32767 + nr] = [];
                this.bitcode[32767 + nr][1] = cat;
                this.bitcode[32767 + nr][0] = nr;
            }
            //Negative numbers
            for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
                this.category[32767 + nrneg] = cat;
                this.bitcode[32767 + nrneg] = [];
                this.bitcode[32767 + nrneg][1] = cat;
                this.bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
            }
            nrlower <<= 1;
            nrupper <<= 1;
        }
    }

    initRGBYUVTable() {
        for (var i = 0; i < 256; i++) {
            this.RGB_YUV_TABLE[i] = 19595 * i;
            this.RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
            this.RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
            this.RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
            this.RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
            this.RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
            this.RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
            this.RGB_YUV_TABLE[(i + 1792) >> 0] = - 5329 * i;
        }
    }

    // IO functions
     writeBits(bs: number[]) {
        var value = bs[0];
        var posval = bs[1] - 1;
        while (posval >= 0) {
            if (value & (1 << posval)) {
                this.bytenew |= (1 << this.bytepos);
            }
            posval--;
            this.bytepos--;
            if (this.bytepos < 0) {
                if (this.bytenew == 0xFF) {
                    this.writeByte(0xFF);
                    this.writeByte(0);
                }
                else {
                    this.writeByte(this.bytenew);
                }
                this.bytepos = 7;
                this.bytenew = 0;
            }
        }
    }

    writeByte(value: number) {
        // this.byteout.push(this.clt[value]); // write char directly instead of converting later
        this.byteout.push(value);
    }

    writeWord(value: number) {
        this.writeByte((value >> 8) & 0xFF);
        this.writeByte((value) & 0xFF);
    }

    writeHeader() {
        const header_jfif = new Uint8Array([
            0xFF, 0xD8,
            0xFF, 0xE0,
            0   , 16,
            0x4A, 0x46, 0x49, 0x46, 0, // JFIF identifier, zero-terminated
            1,1,
            0,
            0,1,0,1,
            0,0 
        ]);
        header_jfif.forEach((x) => this.writeByte(x))
    }

    // DCT & quantization core
    fDCTQuant(data: number[], fdtbl: number[]) {
        var d0, d1, d2, d3, d4, d5, d6, d7;
        /* Pass 1: process rows. */
        var dataOff = 0;
        var i;
        var I8 = 8;
        var I64 = 64;
        for (i = 0; i < I8; ++i) {
            d0 = data[dataOff];
            d1 = data[dataOff + 1];
            d2 = data[dataOff + 2];
            d3 = data[dataOff + 3];
            d4 = data[dataOff + 4];
            d5 = data[dataOff + 5];
            d6 = data[dataOff + 6];
            d7 = data[dataOff + 7];

            var tmp0 = d0 + d7;
            var tmp7 = d0 - d7;
            var tmp1 = d1 + d6;
            var tmp6 = d1 - d6;
            var tmp2 = d2 + d5;
            var tmp5 = d2 - d5;
            var tmp3 = d3 + d4;
            var tmp4 = d3 - d4;

            /* Even part */
            var tmp10 = tmp0 + tmp3;	/* phase 2 */
            var tmp13 = tmp0 - tmp3;
            var tmp11 = tmp1 + tmp2;
            var tmp12 = tmp1 - tmp2;

            data[dataOff] = tmp10 + tmp11; /* phase 3 */
            data[dataOff + 4] = tmp10 - tmp11;

            var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
            data[dataOff + 2] = tmp13 + z1; /* phase 5 */
            data[dataOff + 6] = tmp13 - z1;

            /* Odd part */
            tmp10 = tmp4 + tmp5; /* phase 2 */
            tmp11 = tmp5 + tmp6;
            tmp12 = tmp6 + tmp7;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
            var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
            var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
            var z3 = tmp11 * 0.707106781; /* c4 */

            var z11 = tmp7 + z3;	/* phase 5 */
            var z13 = tmp7 - z3;

            data[dataOff + 5] = z13 + z2;	/* phase 6 */
            data[dataOff + 3] = z13 - z2;
            data[dataOff + 1] = z11 + z4;
            data[dataOff + 7] = z11 - z4;

            dataOff += 8; /* advance pointer to next row */
        }

        /* Pass 2: process columns. */
        dataOff = 0;
        for (i = 0; i < I8; ++i) {
            d0 = data[dataOff];
            d1 = data[dataOff + 8];
            d2 = data[dataOff + 16];
            d3 = data[dataOff + 24];
            d4 = data[dataOff + 32];
            d5 = data[dataOff + 40];
            d6 = data[dataOff + 48];
            d7 = data[dataOff + 56];

            var tmp0p2 = d0 + d7;
            var tmp7p2 = d0 - d7;
            var tmp1p2 = d1 + d6;
            var tmp6p2 = d1 - d6;
            var tmp2p2 = d2 + d5;
            var tmp5p2 = d2 - d5;
            var tmp3p2 = d3 + d4;
            var tmp4p2 = d3 - d4;

            /* Even part */
            var tmp10p2 = tmp0p2 + tmp3p2;	/* phase 2 */
            var tmp13p2 = tmp0p2 - tmp3p2;
            var tmp11p2 = tmp1p2 + tmp2p2;
            var tmp12p2 = tmp1p2 - tmp2p2;

            data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
            data[dataOff + 32] = tmp10p2 - tmp11p2;

            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
            data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
            data[dataOff + 48] = tmp13p2 - z1p2;

            /* Odd part */
            tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
            tmp11p2 = tmp5p2 + tmp6p2;
            tmp12p2 = tmp6p2 + tmp7p2;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
            var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
            var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
            var z3p2 = tmp11p2 * 0.707106781; /* c4 */

            var z11p2 = tmp7p2 + z3p2;	/* phase 5 */
            var z13p2 = tmp7p2 - z3p2;

            data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
            data[dataOff + 24] = z13p2 - z2p2;
            data[dataOff + 8] = z11p2 + z4p2;
            data[dataOff + 56] = z11p2 - z4p2;

            dataOff++; /* advance pointer to next column */
        }

        // Quantize/descale the coefficients
        var fDCTQuant;
        for (i = 0; i < I64; ++i) {
            // Apply the quantization and scaling factor & Round to nearest integer
            fDCTQuant = data[i] * fdtbl[i];
            this.outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5) | 0) : ((fDCTQuant - 0.5) | 0);
            //outputfDCTQuant[i] = fround(fDCTQuant);

        }
        return this.outputfDCTQuant;
    }
    // writeAPP1(exifBuffer) {
    //     if (!exifBuffer) return;

    //     this.writeWord(0xFFE1); // APP1 marker

    //     if (exifBuffer[0] === 0x45 &&
    //         exifBuffer[1] === 0x78 &&
    //         exifBuffer[2] === 0x69 &&
    //         exifBuffer[3] === 0x66) {
    //         // Buffer already starts with EXIF, just use it directly
    //         this.writeWord(exifBuffer.length + 2); // length is buffer + length itself!
    //     } else {
    //         // Buffer doesn't start with EXIF, write it for them
    //         this.writeWord(exifBuffer.length + 5 + 2); // length is buffer + EXIF\0 + length itself!
    //         this.writeByte(0x45); // E
    //         this.writeByte(0x78); // X
    //         this.writeByte(0x69); // I
    //         this.writeByte(0x66); // F
    //         this.writeByte(0); // = "EXIF",'\0'
    //     }

    //     for (var i = 0; i < exifBuffer.length; i++) {
    //         this.writeByte(exifBuffer[i]);
    //     }
    // }

    /**
     * Write Image Info 
     */
    writeSOF0(width: number, height: number) {
        this.writeWord(0xFFC0); // marker
        this.writeWord(17);   // length, truecolor YUV JPG
        this.writeByte(8);    // precision
        
        this.writeWord(height);
        this.writeWord(width);

        this.writeByte(3);    // nrofcomponents

        // WRITE Y COMPONENT
        this.writeByte(1);    // IdY
        this.writeByte(0x11); // HVY
        this.writeByte(0);    // QTY
        
        // WRITE Cb COMPONENT
        this.writeByte(2);    // IdU
        this.writeByte(0x11); // HVU
        this.writeByte(1);    // QTU
        
        // WRITE Cr COMPONENT
        this.writeByte(3);    // IdV
        this.writeByte(0x11); // HVV
        this.writeByte(1);    // QTV
    }

    /**
     * Writes quantization tables
     */
    writeDQT() {
        this.writeWord(0xFFDB); // marker
        this.writeWord(132);	   // length
        this.writeByte(0);
        this.YTable.slice(0,64).forEach((y) => this.writeByte(y));
        
        this.writeByte(1);
        this.UVTable.slice(0,64).forEach((u) => this.writeByte(u));
    }

    /**
     * Write Diffie-Hellman Tables
     */
    writeDHT() {
        this.writeWord(0xFFC4); // marker
        this.writeWord(2+208+208); // length

        // store luminance's DC+AC Huffman table definitions
        this.writeByte(0); // HTYDCinfo
        this.std_dc_luminance_nrcodes.slice(1).forEach((x)=>this.writeByte(x));
        this.std_dc_luminance_values.forEach((x)=>this.writeByte(x));

        this.writeByte(0x10); // HTYACinfo
        this.std_ac_luminance_nrcodes.slice(1).forEach((x) => this.writeByte(x));
        this.std_ac_luminance_values.forEach((x) => this.writeByte(x));

        this.writeByte(1); // HTUDCinfo
        this.std_dc_chrominance_nrcodes.slice(1).forEach((x) => this.writeByte(x));
        this.std_dc_chrominance_values.forEach((x) => this.writeByte(x));

        this.writeByte(0x11); // HTUACinfo
        this.std_ac_chrominance_nrcodes.slice(1).forEach((x) => this.writeByte(x));
        this.std_ac_chrominance_values.forEach((x) => this.writeByte(x));
    }

    // writeCOM(comments) {
    //     if (typeof comments === "undefined" || comments.constructor !== Array) return;
    //     comments.forEach(e => {
    //         if (typeof e !== "string") return;
    //         this.writeWord(0xFFFE); // marker
    //         var l = e.length;
    //         this.writeWord(l + 2); // length itself as well
    //         var i;
    //         for (i = 0; i < l; i++)
    //             this.writeByte(e.charCodeAt(i));
    //     });
    // }

    writeSOS() {
        this.writeWord(0xFFDA); // marker
        this.writeWord(12); // length
        this.writeByte(3); // nrofcomponents
        this.writeByte(1); // IdY
        this.writeByte(0); // HTY
        this.writeByte(2); // IdU
        this.writeByte(0x11); // HTU
        this.writeByte(3); // IdV
        this.writeByte(0x11); // HTV
        this.writeByte(0); // Ss
        this.writeByte(0x3f); // Se
        this.writeByte(0); // Bf
    }

    processDU(CDU: number[], fdtbl: number[], DC: number, HTDC: number[][], HTAC: number[][]) {
        var EOB = HTAC[0x00];
        var M16zeroes = HTAC[0xF0];
        var pos;
        var I16 = 16;
        var I63 = 63;
        var I64 = 64;
        var DU_DCT = this.fDCTQuant(CDU, fdtbl);
        //ZigZag reorder
        for (var j = 0; j < I64; ++j) {
            this.DU[this.ZigZag[j]] = DU_DCT[j];
        }
        var Diff = this.DU[0] - DC;
        DC = this.DU[0];
        //Encode DC
        if (Diff == 0) {
            this.writeBits(HTDC[0]); // Diff might be 0
        } else {
            pos = 32767 + Diff;
            this.writeBits(HTDC[this.category[pos]]);
            this.writeBits(this.bitcode[pos]);
        }
        //Encode ACs
        var end0pos = 63; // was const... which is crazy
        for (; (end0pos > 0) && (this.DU[end0pos] == 0); end0pos--) { };
        //end0pos = first element in reverse order !=0
        if (end0pos == 0) {
            this.writeBits(EOB);
            return DC;
        }
        var i = 1;
        var lng;
        while (i <= end0pos) {
            var startpos = i;
            for (; (this.DU[i] == 0) && (i <= end0pos); ++i) { }
            var nrzeroes = i - startpos;
            if (nrzeroes >= I16) {
                lng = nrzeroes >> 4;
                for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
                    this.writeBits(M16zeroes);
                nrzeroes = nrzeroes & 0xF;
            }
            pos = 32767 + this.DU[i];
            this.writeBits(HTAC[(nrzeroes << 4) + this.category[pos]]);
            this.writeBits(this.bitcode[pos]);
            i++;
        }
        if (end0pos != I63) {
            this.writeBits(EOB);
        }
        return DC;
    }

    initCharLookupTable() {
        var sfcc = String.fromCharCode;
        for (var i = 0; i < 256; i++) { ///// ACHTUNG // 255
            this.clt[i] = sfcc(i);
        }
    }

    encode(image: {data: Buffer, width: number, height: number}, quality: number) // image data object
    {
        if (quality) this.setQuality(quality);

        // Initialize bit writer
        this.byteout = new Array();
        this.bytenew = 0;
        this.bytepos = 7;

        // Add JPEG headers
        this.writeHeader();
        this.writeDQT();
        this.writeSOF0(image.width, image.height);
        this.writeDHT();
        this.writeSOS();


        // Encode 8x8 macroblocks
        var DCY = 0;
        var DCU = 0;
        var DCV = 0;

        this.bytenew = 0;
        this.bytepos = 7;


        var imageData = image.data;
        var width = image.width;
        var height = image.height;

        var quadWidth = width * 4;
        var tripleWidth = width * 3;

        var x, y = 0;
        var r, g, b;
        var start, p, col, row, pos;
        while (y < height) {
            x = 0;
            while (x < quadWidth) {
                start = quadWidth * y + x;
                p = start;
                col = -1;
                row = 0;

                for (pos = 0; pos < 64; pos++) {
                    row = pos >> 3;// /8
                    col = (pos & 7) * 4; // %8
                    p = start + (row * quadWidth) + col;

                    if (y + row >= height) { // padding bottom
                        p -= (quadWidth * (y + 1 + row - height));
                    }

                    if (x + col >= quadWidth) { // padding right	
                        p -= ((x + col) - quadWidth + 4)
                    }

                    r = imageData[p++];
                    g = imageData[p++];
                    b = imageData[p++];


                    /* // calculate YUV values dynamically
                    YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                    UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                    VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                    */

                    // use lookup table (slightly faster)
                    this.YDU[pos] = ((this.RGB_YUV_TABLE[r] + this.RGB_YUV_TABLE[(g + 256) >> 0] + this.RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
                    this.UDU[pos] = ((this.RGB_YUV_TABLE[(r + 768) >> 0] + this.RGB_YUV_TABLE[(g + 1024) >> 0] + this.RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
                    this.VDU[pos] = ((this.RGB_YUV_TABLE[(r + 1280) >> 0] + this.RGB_YUV_TABLE[(g + 1536) >> 0] + this.RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

                }

                DCY = this.processDU(this.YDU, this.fdtbl_Y, DCY, this.YDC_HT, this.YAC_HT);
                DCU = this.processDU(this.UDU, this.fdtbl_UV, DCU, this.UVDC_HT, this.UVAC_HT);
                DCV = this.processDU(this.VDU, this.fdtbl_UV, DCV, this.UVDC_HT, this.UVAC_HT);
                x += 32;
            }
            y += 8;
        }


        ////////////////////////////////////////////////////////////////

        // Do the bit alignment of the EOI marker
        if (this.bytepos >= 0) {
            var fillbits = [];
            fillbits[1] = this.bytepos + 1;
            fillbits[0] = (1 << (this.bytepos + 1)) - 1;
            this.writeBits(fillbits);
        }

        this.writeWord(0xFFD9); //EOI

        return Buffer.from(this.byteout);
    }

    setQuality(quality: number) {
        if (quality <= 0) {
            quality = 1;
        }
        if (quality > 100) {
            quality = 100;
        }

        if (this.currentQuality == quality) return // don't recalc if unchanged

        var sf = 0;
        if (quality < 50) {
            sf = Math.floor(5000 / quality);
        } else {
            sf = Math.floor(200 - quality * 2);
        }

        this.initQuantTables(sf);
        this.currentQuality = quality;
        //console.log('Quality set to: '+quality +'%');
    }
};


function encode(imgData: {data: Buffer, width: number, height: number}, qu: number) {
    if (typeof qu === 'undefined') qu = 50;
    var encoder = new JPEGEncoder(qu);
    var data = encoder.encode(imgData, qu);
    return {
        data: data,
        width: imgData.width,
        height: imgData.height,
    };
}

export default encode;
