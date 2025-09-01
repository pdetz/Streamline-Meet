import { assignProperties } from "@models/assignProperties";
const bg = "#fff";

class S {
    constructor( d ) {
        assignProperties(this, d,  {
            w: 10,
            tw: 5,
            h: 30,
            tg: 15,
            r1: 10,
            r2: 15,
            colors: [
                '#adf',
                '#6af',
                '#04f'
            ]
        });
        this.tw = 3 * this.g;
        this.tg = this.g + 1;
    }

    setColors(colors) {
        this.colors = colors;
    }

    outerCurvePoints(slant=0) {
        const yTaper1 = this.h/2 + this.tg/2 + this.tw;
        const yTaper2 = this.tg/2 + this.h/2;
        const yLine1 = this.h + this.w/2;
        const yLine2 = this.h - this.w/2;

        const circleX = (r, y) => Math.sqrt(r**2 - y**2);
        const xTaper1 = circleX(this.r1, this.tg/2 + this.tw);
        const xTaper2 = circleX(this.r1, this.tg/2);
        
        const xLine1 = circleX(this.r2, this.h/2 + this.w/2 - 0.2*slant)+slant;
        const xLine2 = circleX(this.r2, this.h/2 - this.w/2 - 0*slant)+slant/2;

        
        const p0 = new P(-100, yTaper1);

        const p1 = new P(-100 + xTaper1, yTaper1);
        const p2 = new P(-100 + xLine1, yLine1);
        
        const p3 = new P(100, yLine1);
        const p4 = new P(100, yLine2);
        
        const p5 = new P(-100 + xLine2, yLine2);
        const p6 = new P(-100 + xTaper2, yTaper2);
        
        const p7 = new P(-100, yTaper2);

        const c1a = p1.add((yLine1 - yTaper1) * this.k1/20, 0);
        const c1b = p2.add((yTaper1 - yLine1) * this.k1/20, 0);
        const c2a = p5.add((yTaper2 - yLine2) * this.k2/20, 0);
        const c2b = p6.add((yLine2 - yTaper2) * this.k2/20, 0);

        const l0 = P.midpoint(p0, p7);
        const l1 = P.midpoint(p1, p6);
        const l2 = P.midpoint(p2, p5);
        const l3 = P.midpoint(p3, p4);
        const cla = P.midpoint(c1a, c2b);
        const clb = P.midpoint(c1b, c2a);

        return new Points([
            p0, p1, p2, p3, p4, p5, p6, p7, // p0-7
            c1a, c1b, c2a, c2b, // 8, 9, 10, 11
            l0, l1, l2, l3, // 12, 13, 14, 15
            cla, clb // 16, 17
        ]);
    }

    innerCurvePoints() {
        const ocPoints = this.outerCurvePoints();
        const p = ocPoints.points;
        const rp = ocPoints.reflect(0, this.h).points;
        const streamline = [
            p[0], p[1], p[2],   // p0-2
            rp[5], rp[6], rp[7], rp[0], rp[1], rp[2], // p3-8
            p[5], p[6], p[7],   // p9-11   streamline body
            p[8], p[9], p[10], p[11], // p12-15   control points
            rp[10], rp[11], rp[8], rp[9], // p16-19   control points
            p[12], p[13], p[14], // p20-22   gap points
            rp[14], rp[13], rp[12], // p23-25   gap points
            p[16], p[17], // p26-27   control points
            rp[17], rp[16], // p28-29   control points
        ]
        return new Points(streamline);
    }

    innerCurveSVG(points, color) {
        const p = points.points;
        const streamline = `M ${p[0].x} ${p[0].y}
            L ${p[1].x} ${p[1].y}
            C ${p[12].x} ${p[12].y}, ${p[13].x} ${p[13].y}, ${p[2].x} ${p[2].y}        
            L ${p[3].x} ${p[3].y}
            C ${p[16].x} ${p[16].y}, ${p[17].x} ${p[17].y}, ${p[4].x} ${p[4].y}
            L ${p[5].x} ${p[5].y}
            L ${p[6].x} ${p[6].y}
            L ${p[7].x} ${p[7].y}
            C ${p[18].x} ${p[18].y}, ${p[19].x} ${p[19].y}, ${p[8].x} ${p[8].y}
            L ${p[9].x} ${p[9].y}
            C ${p[14].x} ${p[14].y}, ${p[15].x} ${p[15].y}, ${p[10].x} ${p[10].y}
            L ${p[11].x} ${p[11].y}
            Z`;
        const gap = `M ${p[20].x} ${p[20].y}
                    L ${p[21].x} ${p[21].y}
                    C ${p[26].x} ${p[26].y}, ${p[27].x} ${p[27].y}, ${p[22].x} ${p[22].y}
                    L ${p[23].x} ${p[23].y}
                    C ${p[28].x} ${p[28].y}, ${p[29].x} ${p[29].y}, ${p[24].x} ${p[24].y}
                    L ${p[25].x} ${p[25].y}`;
            return `<path d="${streamline}" fill="${color}" stroke="${color}" stroke-width="1"/>
                <path d="${gap}" fill="none" stroke="${bg}" stroke-width="${this.g}"/>`;
    }

    outerCurveSVG(points, color) {
        const p = points.points;
        const c1a = p[8];
        const c1b = p[9];
        const c2a = p[10];
        const c2b = p[11];
        const cla = p[16];
        const clb = p[17];

        const streamline = `M ${p[0].x} ${p[0].y}
            L ${p[1].x} ${p[1].y}
            C ${c1a.x} ${c1a.y}, ${c1b.x} ${c1b.y}, ${p[2].x} ${p[2].y}        
            L ${p[3].x} ${p[3].y}
            L ${p[4].x} ${p[4].y}
            L ${p[5].x} ${p[5].y}
            C ${c2a.x} ${c2a.y}, ${c2b.x} ${c2b.y}, ${p[6].x} ${p[6].y}
            L ${p[7].x} ${p[7].y}
            Z`;
        
        const gap = `M ${p[12].x} ${p[12].y}
                    L ${p[13].x} ${p[13].y}
                    C ${cla.x} ${cla.y}, ${clb.x} ${clb.y}, ${p[14].x} ${p[14].y}
                    L ${p[15].x} ${p[15].y}`;

        return `<path d="${streamline}" fill="${color}" stroke="${color}" stroke-width="1"/>
                        <path d="${gap}" fill="none" stroke="${bg}" stroke-width="${this.g}"/>`;
    }

    svg(width, height) {
        const top = this.outerCurvePoints(this.s).reflect(null, 0);
        const bottom = top.reflect(0, 0);
        const middle = this.innerCurvePoints().add(0, -this.h);//.reflect(null, 0);

        return `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" viewBox="-100 -100 200 200">
                    <defs>
                        <clipPath id="circleClip">
                            <circle cx="0" cy="0" r="100" />
                        </clipPath>
                    </defs>
                    <g clip-path="url(#circleClip)">
                        <rect x="-100" y="-100" width="200" height="200" fill="${bg}"/>
                        ${this.outerCurveSVG(top, this.colors[0])}
                        ${this.innerCurveSVG(middle, this.colors[1])}
                        ${this.outerCurveSVG(bottom, this.colors[2])}
                    </g>
                    <circle cx="0" cy="0" r="100" fill="none" stroke="${bg}" stroke-width='1'/> 
                </svg>`;
    }

}

class Points {
    constructor(points) {
        this.points = points;
    }

    add(dx, dy) {
        return new Points( 
            this.points.map((point) => point.add(dx, dy))
        );
    }

    reflect(rx, ry) {
        return new Points( 
            this.points.map((point) => point.reflect(rx, ry))
        );
    }
}

class P {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(dx, dy) {
        return new P(this.x + dx, this.y + dy);
    }

    reflect(rx, ry) {
        let tx = this.x;
        let ty = this.y;
        if (typeof rx === 'number') tx = 2 * rx - tx;
        if (typeof ry === 'number') ty = 2 * ry - ty;
        return new P(tx, ty);
    }

    static midpoint(p1, p2) {
        return new P((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    }
}

export default S;