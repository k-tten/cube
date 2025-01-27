const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Cube {
    static SIZE = 50;

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.xa = 0;
        this.ya = 0;
        this.za = 0;
    }

    computeMesh() {
        const { x, y, z } = this;
        const o = Cube.SIZE / 2;

        const vertices = [
            [x - o, y - o, z - o],
            [x - o, y - o, z + o],
            [x - o, y + o, z - o],
            [x - o, y + o, z + o],
            [x + o, y - o, z - o],
            [x + o, y - o, z + o],
            [x + o, y + o, z - o],
            [x + o, y + o, z + o],
        ].map((pt) =>
            rotate3d(pt, [this.xa, this.ya, this.za], [this.x, this.y, this.z])
        );

        return {
            vertices,
            edges: [
                [0, 1],
                [1, 3],
                [3, 2],
                [2, 0],
                [0, 4],
                [4, 5],
                [5, 7],
                [7, 6],
                [6, 4],
                [1, 5],
                [3, 7],
                [2, 6],
            ],
        };
    }
}

const FOCUS = 256;

function project2d([x, y, z]) {
    return [(x / z) * FOCUS, (y / z) * FOCUS];
}

function rotate3d([x, y, z], [φ, θ, ψ], [ox, oy, oz] = [0, 0, 0]) {
    const { cos, sin } = Math;

    const cosφ = cos(φ);
    const cosθ = cos(θ);
    const cosψ = cos(ψ);

    const sinφ = sin(φ);
    const sinθ = sin(θ);
    const sinψ = sin(ψ);

    const a11 = cosθ * cosψ;
    const a12 = cosφ * sinψ + sinφ * sinθ * cosψ;
    const a13 = sinφ * sinψ - cosφ * sinθ * cosψ;
    const a21 = -cosθ * sinψ;
    const a22 = cosφ * cosψ - sinφ * sinθ * sinψ;
    const a23 = sinφ * cosψ + cosφ * sinθ * sinψ;
    const a31 = sinθ;
    const a32 = -sinφ * cosθ;
    const a33 = cosφ * cosθ;

    const nx = x - ox;
    const ny = y - oy;
    const nz = z - oz;

    return [
        ox + a11 * nx + a12 * ny + a13 * nz,
        oy + a21 * nx + a22 * ny + a23 * nz,
        oz + a31 * nx + a32 * ny + a33 * nz,
    ];
}

const cube = new Cube(0, 0, 50);

function actionPerformed() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);

    const mesh = cube.computeMesh();

    mesh.vertices
        .map((pt) => project2d(pt))
        .forEach(([x, y], i) => {
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.fillText(i, x - 4, y - 6);
        });

    mesh.edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(...project2d(mesh.vertices[a]));
        ctx.lineTo(...project2d(mesh.vertices[b]));
        ctx.closePath();
        ctx.stroke();
    });

    cube.xa += 0.01;
    cube.ya += 0.02;
    cube.za += 0.03;

    ctx.restore();

    requestAnimationFrame(actionPerformed);
}

requestAnimationFrame(actionPerformed);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
