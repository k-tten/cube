const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const IS_ORTHOGRAPHIC = false;

class Cube {
    constructor(x, y, z, size, textures) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.xa = 0;
        this.ya = 0;
        this.za = 0;

        this.size = size;
        this.textures = textures ?? [];
    }

    computeMesh() {
        const { x, y, z } = this;
        const o = this.size / 2;

        const vertices = [
            [x - o, y - o, z - o], // 0 top    left  front
            [x - o, y - o, z + o], // 1 top    left  back
            [x - o, y + o, z - o], // 2 bottom left  front
            [x - o, y + o, z + o], // 3 bottom left  back
            [x + o, y - o, z - o], // 4 top    right front
            [x + o, y - o, z + o], // 5 top    right back
            [x + o, y + o, z - o], // 6 bottom right front
            [x + o, y + o, z + o], // 7 bottom right back
        ].map((pt) => rotate3d(pt, [this.xa, this.ya, this.za], [this.x, this.y, this.z]));

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
            // LIST POINTS IN CLOCKWISE ORDER
            faces: [
                [0, 4, 5, 1], // top
                [2, 3, 7, 6], // bottom
                [1, 3, 2, 0], // left
                [6, 7, 5, 4], // right
                [1, 5, 7, 3], // back
                [0, 2, 6, 4], // front
            ],
            textures: this.textures.slice(),
        };
    }
}

const WHITE = "#FEFEFE";
const BLACK = "#1B1B1D";
const ORANGE = "#EC702D";
const RED = "#BD2827";
const YELLOW = "#EECF4E";
const GREEN = "#7CB257";
const BLUE = "#2C5DA6";

class Puzzle {
    static RENDER_VERTICES = false;
    static RENDER_EDGES = false;
    static RENDER_FACES = true;

    static SIZE = IS_ORTHOGRAPHIC ? 100 : 5;

    constructor(x, y, z) {
        this.cubes = [
            new Cube(x - Puzzle.SIZE, y - Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y - Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y - Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y + Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y + Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x - Puzzle.SIZE, y + Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [ORANGE, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x, y - Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x, y - Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x, y - Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x, y, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x, y, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x, y, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x, y + Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x, y + Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x, y + Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y - Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y - Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y - Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLUE, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y + Puzzle.SIZE, z - Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [WHITE, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y + Puzzle.SIZE, z, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [BLACK, BLACK],
                [BLACK, BLACK],
            ]),
            new Cube(x + Puzzle.SIZE, y + Puzzle.SIZE, z + Puzzle.SIZE, Puzzle.SIZE, [
                [BLACK, BLACK],
                [GREEN, BLACK],
                [BLACK, BLACK],
                [YELLOW, BLACK],
                [RED, BLACK],
                [BLACK, BLACK],
            ]),
        ];

        this.x = x;
        this.y = y;
        this.z = z;

        this.xa = 0;
        this.ya = 0;
        this.za = 0;
    }

    draw(ctx) {
        const group = {
            vertices: [],
            edges: [],
            faces: [],
            textures: [],
        };

        for (const cube of this.cubes) {
            const mesh = cube.computeMesh();

            mesh.vertices = mesh.vertices.map((pt) =>
                rotate3d(pt, [this.xa, this.ya, this.za], [this.x, this.y, this.z])
            );

            group.edges.push(...mesh.edges.map((x) => x.map((n) => n + group.vertices.length)));
            group.faces.push(...mesh.faces.map((x) => x.map((n) => n + group.vertices.length)));

            group.vertices.push(...mesh.vertices);

            group.textures.push(...mesh.textures);
        }

        const sortedFaces = group.faces
            .map((indices, i) => ({ indices, texture: group.textures[i] }))
            .sort(({ indices: a }, { indices: b }) => {
                const az = a.reduce((t, i) => t + group.vertices[i][2], 0) / a.length;
                const bz = b.reduce((t, i) => t + group.vertices[i][2], 0) / b.length;

                return bz - az;
            });

        for (const { indices, texture } of sortedFaces) {
            if (typeof texture === "string") {
                /* image texture */
            }

            if (Array.isArray(texture)) {
                const toCamera = IS_ORTHOGRAPHIC
                    ? [0, 0, -1]
                    : (() => {
                          const vertices = indices.map((i) => group.vertices[i]);

                          const avgx = vertices.reduce((t, v) => t + v[0], 0) / vertices.length;
                          const avgy = vertices.reduce((t, v) => t + v[1], 0) / vertices.length;
                          const avgz = vertices.reduce((t, v) => t + v[2], 0) / vertices.length;

                          return [-avgx, -avgy, -avgz];
                      })();

                if (
                    facingDirection(
                        indices.map((i) => group.vertices[i]),
                        toCamera
                    )
                ) {
                    ctx.beginPath();
                    ctx.moveTo(...project2d(group.vertices[indices[0]]));
                    for (const pt of indices.slice(1)) ctx.lineTo(...project2d(group.vertices[pt]));
                    ctx.closePath();

                    ctx.fillStyle = texture[0];

                    ctx.fill();
                }
            }
        }
    }
}

const ZOOM = 1000;

function project2d([x, y, z]) {
    return IS_ORTHOGRAPHIC ? [x, y] : [(x / z) * ZOOM, (y / z) * ZOOM];
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

function computeNormal([p1, p2, p3]) {
    const a = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    const b = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];

    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function facingDirection(polygon, [d1, d2, d3]) {
    const [n1, n2, n3] = computeNormal(polygon);

    return n1 * d1 + n2 * d2 + n3 * d3 > 0;
}

const puzzle = new Puzzle(0, 0, 50);

// Puzzle.RENDER_EDGES = true;
// Puzzle.RENDER_VERTICES = true;

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
