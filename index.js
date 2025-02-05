const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SETTINGS = {
    IS_ORTHOGRAPHIC: false, // dev setting (will not be toggleable in UI)
    ZOOM: 1000,
    SENSITIVITY: 1, // 0 to 1 (percentage)
};

class Cube {
    constructor(x, y, z, size, textures) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.rotation = [1, 0, 0, 0];

        this.size = size;
        this.textures = textures ?? [];
    }

    rotateAbout(q, point) {
        [this.x, this.y, this.z] = rotate3d([this.x, this.y, this.z], q, point);

        this.rotation = quaternionMult(q, this.rotation);
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
        ].map((pt) => rotate3d(pt, this.rotation, [this.x, this.y, this.z]));

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
    static RENDER_INDICES = false;
    static RENDER_EDGES = false;
    static RENDER_FACES = true;

    static FRONT = 0;
    static BACK = 1;
    static TOP = 2;
    static BOTTOM = 3;

    static get SIZE() {
        return SETTINGS.IS_ORTHOGRAPHIC ? 100 : 5;
    }

    constructor(x, y, z) {
        this.state = [
            [
                [WHITE, WHITE, WHITE], //front
                [WHITE, WHITE, WHITE],
                [WHITE, WHITE, WHITE],
            ],
            [
                [RED, RED, RED], // back
                [RED, RED, RED],
                [RED, RED, RED],
            ],
            [
                [BLUE, BLUE, BLUE], // top
                [BLUE, BLUE, BLUE],
                [BLUE, BLUE, BLUE],
            ],
            [
                [GREEN, GREEN, GREEN], // bottom
                [GREEN, GREEN, GREEN],
                [GREEN, GREEN, GREEN],
            ],
            [
                [ORANGE, ORANGE, ORANGE], // left
                [ORANGE, ORANGE, ORANGE],
                [ORANGE, ORANGE, ORANGE],
            ],
            [
                [YELLOW, YELLOW, YELLOW], // right
                [YELLOW, YELLOW, YELLOW],
                [YELLOW, YELLOW, YELLOW],
            ],
        ];

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

        this.rotation = [1, 0, 0, 0];
    }

    computeMesh() {
        const group = {
            vertices: [],
            edges: [],
            faces: [],
            textures: [],
        };

        for (const cube of this.cubes) {
            const mesh = cube.computeMesh();

            mesh.vertices = mesh.vertices.map((pt) => rotate3d(pt, this.rotation, [this.x, this.y, this.z]));

            group.edges.push(...mesh.edges.map((x) => x.map((n) => n + group.vertices.length)));
            group.faces.push(...mesh.faces.map((x) => x.map((n) => n + group.vertices.length)));

            group.vertices.push(...mesh.vertices);

            group.textures.push(...mesh.textures);
        }

        return group;
    }

    draw(ctx) {
        const mesh = this.computeMesh();

        if (Puzzle.RENDER_VERTICES)
            mesh.vertices
                .map((pt) => project2d(pt))
                .forEach(([x, y], _) => {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fillStyle = "white";
                    ctx.fill();
                });

        if (Puzzle.RENDER_INDICES)
            mesh.vertices
                .map((pt) => project2d(pt))
                .forEach(([x, y], index) => {
                    ctx.fillStyle = "white";
                    ctx.fillText(index, x - 4, y - 4);
                });

        if (Puzzle.RENDER_EDGES)
            mesh.edges.forEach(([a, b]) => {
                ctx.beginPath();
                ctx.moveTo(...project2d(mesh.vertices[a]));
                ctx.lineTo(...project2d(mesh.vertices[b]));
                ctx.closePath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "white";
                ctx.stroke();
            });

        if (Puzzle.RENDER_FACES) {
            const sortedFaces = mesh.faces
                .map((indices, i) => ({ indices, texture: mesh.textures[i] }))
                .sort(({ indices: a }, { indices: b }) => {
                    const az = a.reduce((t, i) => t + mesh.vertices[i][2], 0) / a.length;
                    const bz = b.reduce((t, i) => t + mesh.vertices[i][2], 0) / b.length;

                    return bz - az;
                });

            for (const { indices, texture } of sortedFaces) {
                if (typeof texture === "string") {
                    /* image texture */
                }

                if (Array.isArray(texture)) {
                    const toCamera = SETTINGS.IS_ORTHOGRAPHIC
                        ? [0, 0, -1]
                        : (() => {
                              const vertices = indices.map((i) => mesh.vertices[i]);

                              const avgx = vertices.reduce((t, v) => t + v[0], 0) / vertices.length;
                              const avgy = vertices.reduce((t, v) => t + v[1], 0) / vertices.length;
                              const avgz = vertices.reduce((t, v) => t + v[2], 0) / vertices.length;

                              return [-avgx, -avgy, -avgz];
                          })();

                    if (
                        facingDirection(
                            indices.map((i) => mesh.vertices[i]),
                            toCamera,
                        )
                    ) {
                        ctx.beginPath();
                        ctx.moveTo(...project2d(mesh.vertices[indices[0]]));
                        for (const pt of indices.slice(1)) ctx.lineTo(...project2d(mesh.vertices[pt]));
                        ctx.closePath();

                        ctx.fillStyle = texture[0];

                        ctx.fill();
                    }
                }
            }
        }
    }
}

function project2d([x, y, z]) {
    return SETTINGS.IS_ORTHOGRAPHIC ? [x, y] : [(x / z) * SETTINGS.ZOOM, (y / z) * SETTINGS.ZOOM];
}

function quaternionMult(a, b) {
    return [
        a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], // 1 (scalar part)
        a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2], // i
        a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], // j
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0], // k
    ];
}

function axisToQuaternion(x, y, z, a) {
    const factor = Math.sin(a / 2);

    const i = x * factor;
    const j = y * factor;
    const k = z * factor;

    const w = Math.cos(a / 2);

    const magnitude = Math.hypot(w, i, j, k);

    return [w, i, j, k].map((n) => n / magnitude);
}

function rotate3d([x, y, z], [qw, qx, qy, qz], [ox, oy, oz] = [0, 0, 0]) {
    const a11 = qw ** 2 + qx ** 2 - qy ** 2 - qz ** 2;
    const a12 = 2 * (qx * qy - qw * qz);
    const a13 = 2 * (qz * qx + qw * qy);
    const a21 = 2 * (qx * qy + qw * qz);
    const a22 = qw ** 2 + qy ** 2 - qx ** 2 - qz ** 2;
    const a23 = 2 * (qy * qz - qw * qx);
    const a31 = 2 * (qz * qx - qw * qy);
    const a32 = 2 * (qy * qz + qw * qx);
    const a33 = qw ** 2 + qz ** 2 - qx ** 2 - qy ** 2;

    const nx = x - ox;
    const ny = y - oy;
    const nz = z - oz;

    return [
        ox + a11 * nx + a12 * ny + a13 * nz,
        oy + a21 * nx + a22 * ny + a23 * nz,
        oz + a31 * nx + a32 * ny + a33 * nz,
    ];
}

function facingDirection([p1, p2, p3], d) {
    const a = sub(p2, p1);
    const b = sub(p3, p1);

    const n = cross(a, b);

    return dot(n, d) > 0;
}

const puzzle = new Puzzle(0, 0, 50);

// puzzle.rotation = [0.436, -0.003, -0.854, 0.285];

// puzzle.cubes[0].rotateAbout(axisToQuaternion(0, 1, 0, Math.PI / 2), [
//     puzzle.x,
//     puzzle.y + Puzzle.SIZE,
//     puzzle.z,
// ]);

// Puzzle.RENDER_VERTICES = true;
// Puzzle.RENDER_INDICES = true;
// Puzzle.RENDER_EDGES = true;
// Puzzle.RENDER_FACES = false;

const mouse = {
    x: 0,
    y: 0,
    ox: -1,
    oy: -1,
    lastx: -1,
    lasty: -1,
    down: false,
    context: undefined, // { cube: Cube, face: 2d points, vertices: 3d points, moved: boolean }
};

ctx.translate(canvas.width / 2, canvas.height / 2);

function actionPerformed() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    if (mouse.down) {
        if (!mouse.context) {
            const factor = (2 - SETTINGS.SENSITIVITY) * 200;

            if (mouse.y !== mouse.lasty) {
                puzzle.rotation = quaternionMult(
                    axisToQuaternion(1, 0, 0, (mouse.y - mouse.lasty) / factor),
                    puzzle.rotation,
                );
                mouse.lasty = mouse.y;
            }

            if (mouse.x !== mouse.lastx) {
                puzzle.rotation = quaternionMult(
                    axisToQuaternion(0, 1, 0, -(mouse.x - mouse.lastx) / factor),
                    puzzle.rotation,
                );
                mouse.lastx = mouse.x;
            }
        } else {
            if (
                Math.hypot(mouse.x - mouse.ox, mouse.y - mouse.oy) >
                    (1.01 - SETTINGS.SENSITIVITY) * 0.68 + 1 &&
                !mouse.context.moved
            ) {
                const { cube, face, vertices } = mouse.context;

                const v1 = sub(face[0], face[1]);
                const v2 = sub(face[1], face[2]);
                const v3 = sub(face[2], face[3]);
                const v4 = sub(face[3], face[0]);

                // only need 2 edges since they are parallel in 3D
                const e1 = sub(vertices[0], vertices[1]);
                const e2 = sub(vertices[1], vertices[2]);

                const v = [mouse.x - mouse.ox, mouse.y - mouse.oy];

                // best scores of both sets of edges in 2D
                const v1s = Math.min(dot(v1, v), dot(neg(v1), v), dot(v3, v), dot(neg(v3), v));
                const v2s = Math.min(dot(v2, v), dot(neg(v2), v), dot(v4, v), dot(neg(v4), v));

                // select edge the mouse movement is more closely aligned with
                const n = v1s > v2s ? e1 : e2;

                // rotate cube center to match render
                const p0 = rotate3d([cube.x, cube.y, cube.z], puzzle.rotation, [
                    puzzle.x,
                    puzzle.y,
                    puzzle.z,
                ]);

                const D = dot(n, p0);

                const affectedCubes = puzzle.cubes.filter((c) => {
                    const mesh = c.computeMesh();

                    mesh.vertices = mesh.vertices.map((pt) =>
                        rotate3d(pt, puzzle.rotation, [puzzle.x, puzzle.y, puzzle.z]),
                    );

                    const signs = mesh.vertices.map((p) => Math.sign(dot(p, n) - D));

                    // check if the plane intersects the cube
                    return signs.includes(-1) && signs.includes(1);
                });

                if (affectedCubes.length !== 9)
                    console.warn("test failed: number of affected cubes is not 9");

                const crosses = affectedCubes
                    .slice(0, -2)
                    .map((_, i) => {
                        const a = affectedCubes[i];
                        const b = affectedCubes[i + 1];
                        const c = affectedCubes[i + 2];

                        const v1 = sub([a.x, a.y, a.z], [b.x, b.y, b.z]);
                        const v2 = sub([b.x, b.y, b.z], [c.x, c.y, c.z]);

                        // need to prevent rounding errors
                        const p = cross(v1, v2).map(Math.round);

                        const m = Math.hypot(...p);

                        if (m === 0) return [0, 0, 0];

                        return p.map((x) => Math.abs(x / m));
                    })
                    .filter((x) => x.some((n) => n !== 0));

                const components = new Set(crosses.map((x) => x.indexOf(1)));

                // all affected cubes should point the same direction
                if (components.size > 1)
                    console.warn("test failed: cross products of affected cubes were not uniform");

                const [index] = components;

                // find the correct axis
                const axis = crosses.find((x) => x[index] === 1);

                const cx = affectedCubes.map((c) => c.x).reduce((a, b) => a + b, 0) / affectedCubes.length;
                const cy = affectedCubes.map((c) => c.y).reduce((a, b) => a + b, 0) / affectedCubes.length;
                const cz = affectedCubes.map((c) => c.z).reduce((a, b) => a + b, 0) / affectedCubes.length;

                // direction to rotate
                const dir = 1;

                affectedCubes.forEach((c) => {
                    c.rotateAbout(axisToQuaternion(...axis, (Math.PI / 2) * dir), [cx, cy, cz]);
                });

                mouse.context.moved = true;
            }
        }
    }

    puzzle.draw(ctx);

    requestAnimationFrame(actionPerformed);
}

requestAnimationFrame(actionPerformed);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.translate(canvas.width / 2, canvas.height / 2);
});

function pointermove(e) {
    if ("touches" in e && e.touches.length > 1) return;

    if (mouse.down) {
        mouse.lastx = mouse.x;
        mouse.lasty = mouse.y;
    } else {
        mouse.lastx = -1;
        mouse.lasty = -1;
    }

    mouse.x = e.touches?.[0]?.clientX ?? e.clientX;
    mouse.y = e.touches?.[0]?.clientY ?? e.clientY;
}

function pointerdown(e) {
    if ("touches" in e && e.touches.length > 1) return;

    mouse.x = mouse.ox = mouse.lastx = e.touches?.[0]?.clientX ?? e.clientX;
    mouse.y = mouse.oy = mouse.lasty = e.touches?.[0]?.clientY ?? e.clientY;

    mouse.down = true;

    const realx = mouse.x - canvas.width / 2;
    const realy = mouse.y - canvas.height / 2;

    const mesh = puzzle.computeMesh();

    const sortedFaces = mesh.faces
        .map((indices, i) => ({ indices, cube: puzzle.cubes[Math.floor(i / 6)] }))
        .sort(({ indices: a }, { indices: b }) => {
            const az = a.reduce((t, i) => t + mesh.vertices[i][2], 0) / a.length;
            const bz = b.reduce((t, i) => t + mesh.vertices[i][2], 0) / b.length;

            if (az - bz !== 0) return az - bz;

            const adx = a.reduce((t, i) => t + mesh.vertices[i][0], 0) / a.length - realx;
            const ady = a.reduce((t, i) => t + mesh.vertices[i][1], 0) / a.length - realy;
            const bdx = b.reduce((t, i) => t + mesh.vertices[i][0], 0) / b.length - realx;
            const bdy = b.reduce((t, i) => t + mesh.vertices[i][1], 0) / b.length - realy;

            return Math.hypot(adx, ady) - Math.hypot(bdx, bdy);
        });

    for (const { indices, cube } of sortedFaces) {
        const face = indices.map((i) => project2d(mesh.vertices[i]));

        const minx = Math.min(...face.map((x) => x[0]));
        const maxx = Math.max(...face.map((x) => x[0]));
        const miny = Math.min(...face.map((x) => x[1]));
        const maxy = Math.max(...face.map((x) => x[1]));

        // not in bounding box
        if (realx < minx || realx > maxx || realy < miny || realy > maxy) continue;

        const quad = triangleArea([face[0], face[1], face[2]]) + triangleArea([face[0], face[3], face[2]]);

        const tri1 = triangleArea([face[0], face[1], [realx, realy]]);
        const tri2 = triangleArea([face[1], face[2], [realx, realy]]);
        const tri3 = triangleArea([face[2], face[3], [realx, realy]]);
        const tri4 = triangleArea([face[3], face[0], [realx, realy]]);

        // mouse is outside the face
        if (tri1 + tri2 + tri3 + tri4 > quad) continue;

        mouse.context = { cube, face, vertices: indices.map((i) => mesh.vertices[i]), moved: false };

        break;
    }

    canvas.style.cursor = "grabbing";
}

function pointerup(e) {
    if ("touches" in e && e.touches.length > 1) return;

    mouse.x = mouse.lastx = e.touches?.[0]?.clientX ?? e.clientX;
    mouse.y = mouse.lasty = e.touches?.[0]?.clientY ?? e.clientY;

    mouse.ox = -1;
    mouse.oy = -1;

    mouse.down = false;

    if (mouse.context) {
        if (mouse.context.moved) {
            // perform the rotation, if any
        }

        mouse.context = undefined;
    }

    canvas.style.cursor = "grab";
}

window.addEventListener("touchmove", pointermove);

window.addEventListener("touchstart", pointerdown);

window.addEventListener("touchend", pointerup);

window.addEventListener("mousemove", pointermove);

window.addEventListener("mousedown", pointerdown);

window.addEventListener("mouseup", pointerup);

window.addEventListener("wheel", (e) => {
    if (SETTINGS.ZOOM > 2000 && e.deltaY > 0) return;
    if (SETTINGS.ZOOM < 500 && e.deltaY < 0) return;

    SETTINGS.ZOOM += Math.sign(e.deltaY) * 100 * (SETTINGS.SENSITIVITY + 0.1);
});

// annoying shit pops up on trackpad
window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

function dot(a, b) {
    if (a.length === 2 || b.length === 2) return a[0] * b[0] + a[1] * b[1];

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
    if (a.length === 2 || b.length === 2) return a[0] * b[1] - a[1] * b[0];

    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function add(a, b) {
    if (a.length === 2 || b.length === 2) return [a[0] + b[0], a[1] + b[1]];

    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub(a, b) {
    if (a.length === 2 || b.length === 2) return [a[0] - b[0], a[1] - b[1]];

    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function neg(v) {
    if (v.length === 2) return [-v[0], -v[1]];

    return [-v[0], -v[1], -v[2]];
}

function triangleArea([v0, v1, v2]) {
    const edge1 = sub(v1, v0);
    const edge2 = sub(v2, v0);

    return cross(edge1, edge2) / 2;
}
