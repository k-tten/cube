const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Cube {
    constructor(x, y, z, size) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.xa = 0;
        this.ya = 0;
        this.za = 0;

        this.size = size;
    }

    computeMesh() {
        const { x, y, z } = this;
        const o = this.size / 2;

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
                [0, 2],
                [0, 4],
                [1, 3],
                [1, 5],
                [2, 3],
                [2, 6],
                [3, 7],
                [4, 5],
                [4, 6],
                [5, 7],
                [6, 7],
            ],
        };
    }
}

class Puzzle {
    constructor(x, y, z) {
        this.cubes = [
            new Cube(x - 16, y - 16, z - 16, 16),
            new Cube(x - 16, y - 16, z, 16),
            new Cube(x - 16, y - 16, z + 16, 16),
            new Cube(x - 16, y, z - 16, 16),
            new Cube(x - 16, y, z, 16),
            new Cube(x - 16, y, z + 16, 16),
            new Cube(x - 16, y + 16, z - 16, 16),
            new Cube(x - 16, y + 16, z, 16),
            new Cube(x - 16, y + 16, z + 16, 16),
            new Cube(x, y - 16, z - 16, 16),
            new Cube(x, y - 16, z, 16),
            new Cube(x, y - 16, z + 16, 16),
            new Cube(x, y, z - 16, 16),
            // new Cube(x, y, z, 16),
            new Cube(x, y, z + 16, 16),
            new Cube(x, y + 16, z - 16, 16),
            new Cube(x, y + 16, z, 16),
            new Cube(x, y + 16, z + 16, 16),
            new Cube(x + 16, y - 16, z - 16, 16),
            new Cube(x + 16, y - 16, z, 16),
            new Cube(x + 16, y - 16, z + 16, 16),
            new Cube(x + 16, y, z - 16, 16),
            new Cube(x + 16, y, z, 16),
            new Cube(x + 16, y, z + 16, 16),
            new Cube(x + 16, y + 16, z - 16, 16),
            new Cube(x + 16, y + 16, z, 16),
            new Cube(x + 16, y + 16, z + 16, 16),
        ];

        this.x = x;
        this.y = y;
        this.z = z;

        this.xa = 0;
        this.ya = 0;
        this.za = 0;
    }

    draw(ctx) {
        for (const cube of this.cubes) {
            const mesh = cube.computeMesh();

            mesh.vertices = mesh.vertices.map((pt) =>
                rotate3d(
                    pt,
                    [this.xa, this.ya, this.za],
                    [this.x, this.y, this.z]
                )
            );

            mesh.vertices
                .map((pt) => project2d(pt))
                .forEach(([x, y], _) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                });

            mesh.edges.forEach(([a, b]) => {
                ctx.beginPath();
                ctx.moveTo(...project2d(mesh.vertices[a]));
                ctx.lineTo(...project2d(mesh.vertices[b]));
                ctx.closePath();
                ctx.stroke();
            });
        }
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

const puzzle = new Puzzle(0, 0, 50);

function actionPerformed() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);

    puzzle.draw(ctx);

    puzzle.xa += 0.01;
    puzzle.ya += 0.02;
    puzzle.za += 0.03;

    ctx.restore();

    requestAnimationFrame(actionPerformed);
}

requestAnimationFrame(actionPerformed);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
