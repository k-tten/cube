const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

class Puzzle {
    constructor(x, y, z) {
        this.cubes = [
            // new Cube(x - 16, y - 16, z - 16, 16),
            // new Cube(x - 16, y - 16, z, 16),
            // new Cube(x - 16, y - 16, z + 16, 16),
            // new Cube(x - 16, y, z - 16, 16),
            // new Cube(x - 16, y, z, 16),
            // new Cube(x - 16, y, z + 16, 16),
            // new Cube(x - 16, y + 16, z - 16, 16),
            // new Cube(x - 16, y + 16, z, 16),
            // new Cube(x - 16, y + 16, z + 16, 16),
            // new Cube(x, y - 16, z - 16, 16),
            // new Cube(x, y - 16, z, 16),
            // new Cube(x, y - 16, z + 16, 16),
            // new Cube(x, y, z - 16, 16),
            new Cube(x, y, z, 16, [
                ["red", "black"],
                ["orange", "black"],
                ["yellow", "black"],
                ["green", "black"],
                ["blue", "black"],
                ["purple", "black"],
            ]),
            // new Cube(x, y, z + 16, 16),
            // new Cube(x, y + 16, z - 16, 16),
            // new Cube(x, y + 16, z, 16),
            // new Cube(x, y + 16, z + 16, 16),
            // new Cube(x + 16, y - 16, z - 16, 16),
            // new Cube(x + 16, y - 16, z, 16),
            // new Cube(x + 16, y - 16, z + 16, 16),
            // new Cube(x + 16, y, z - 16, 16),
            // new Cube(x + 16, y, z, 16),
            // new Cube(x + 16, y, z + 16, 16),
            // new Cube(x + 16, y + 16, z - 16, 16),
            // new Cube(x + 16, y + 16, z, 16),
            // new Cube(x + 16, y + 16, z + 16, 16),
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

            // mesh.vertices
            //     .map((pt) => project2d(pt))
            //     .forEach(([x, y], _) => {
            //         ctx.beginPath();
            //         ctx.arc(x, y, 2, 0, 2 * Math.PI);
            //         ctx.closePath();
            //         ctx.fill();
            //     });

            // mesh.edges.forEach(([a, b]) => {
            //     ctx.beginPath();
            //     ctx.moveTo(...project2d(mesh.vertices[a]));
            //     ctx.lineTo(...project2d(mesh.vertices[b]));
            //     ctx.closePath();
            //     ctx.stroke();
            // });

            mesh.faces
                .slice()
                .map((indices, i) => ({ indices, texture: mesh.textures[i] }))
                .sort(({ indices: a }, { indices: b }) => {
                    const az =
                        a.reduce((t, i) => t + mesh.vertices[i][2], 0) /
                        a.length;

                    const bz =
                        b.reduce((t, i) => t + mesh.vertices[i][2], 0) /
                        b.length;

                    return bz - az;
                })
                .forEach(({ indices, texture }, i) => {
                    ctx.beginPath();
                    ctx.moveTo(...project2d(mesh.vertices[indices[0]]));
                    for (const pt of indices.slice(1))
                        ctx.lineTo(...project2d(mesh.vertices[pt]));
                    ctx.closePath();

                    if (typeof texture === "string") {
                        /* image texture */
                    }

                    if (Array.isArray(texture)) {
                        if (
                            facingDirection(
                                indices.map((i) => mesh.vertices[i]),
                                [0, 0, -1]
                            )
                        ) {
                            ctx.fillStyle = texture[0];

                            ctx.fill();
                        }
                    }
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

function computeNormal([p1, p2, p3]) {
    const a = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    const b = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];

    const normal = [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];

    const magnitude = Math.hypot(...normal);

    return magnitude ? normal.map((n) => n / magnitude) : [0, 0, 0];
}

function facingDirection(polygon, [d1, d2, d3]) {
    const [n1, n2, n3] = computeNormal(polygon);

    return n1 * d1 + n2 * d2 + n3 * d3 > 0;
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
