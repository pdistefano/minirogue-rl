import { random, times } from "lodash";
import ecs from "../state/ecs";
import { rectangle, rectsIntersect } from "./grid";
import { Position } from "../state/components";
import { grid } from "./canvas";
import { Floor, Wall } from "../state/prefabs";

function digHorizontalPassage(x1, x2, y, z) {
  const tiles = {};
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2) + 1;
  let x = start;

  while (x < end) {
    tiles[`${x},${y},${z}`] = { x, y, z, sprite: Floor.name };
    x++;
  }

  return tiles;
}

function digVerticalPassage(y1, y2, x, z) {
  const tiles = {};
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2) + 1;
  let y = start;

  while (y < end) {
    tiles[`${x},${y},${z}`] = { x, y, z, sprite: Floor.name };
    y++;
  }

  return tiles;
}

export const createDungeon = ({
  x,
  y,
  z,
  width,
  height,
  minRoomSize = 5,
  maxRoomSize = Math.min(grid.map.height - 2, 12),
  maxRoomCount = 18,
}) => {
  // fill the entire space with walls so we can dig it out later
  const dungeon = rectangle(
    { x, y, z, width, height },
    {
      sprite: Wall.name,
    }
  );

  const rooms = [];
  let roomTiles = {};

  times(maxRoomCount, () => {
    let rw = random(minRoomSize, maxRoomSize);
    let rh = random(minRoomSize, maxRoomSize);
    let rx = random(x, width + x - rw - 1);
    let ry = random(y, height + y - rh - 1);

    // create a candidate room
    const candidate = rectangle(
      { x: rx, y: ry, z, width: rw, height: rh, hasWalls: true },
      { sprite: Floor.name }
    );

    // test if candidate is overlapping with any existing rooms
    if (!rooms.some((room) => rectsIntersect(room, candidate))) {
      rooms.push(candidate);
      roomTiles = { ...roomTiles, ...candidate.tiles };
    }
  });

  let prevRoom = null;
  let passageTiles;

  for (let room of rooms) {
    if (prevRoom) {
      const prev = prevRoom.center;
      const curr = room.center;

      passageTiles = {
        ...passageTiles,
        ...digHorizontalPassage(prev.x, curr.x, curr.y, z),
        ...digVerticalPassage(prev.y, curr.y, prev.x, z),
      };
    }

    prevRoom = room;
  }

  dungeon.rooms = rooms;
  dungeon.tiles = { ...dungeon.tiles, ...roomTiles, ...passageTiles };

  // create tile entities
  Object.keys(dungeon.tiles).forEach((key) => {
    const tile = dungeon.tiles[key];

    if (tile.sprite === Wall.name) {
      ecs.createPrefab(Wall.name).add(Position, { ...dungeon.tiles[key], z });
    }

    if (tile.sprite === Floor.name) {
      ecs.createPrefab(Floor.name).add(Position, { ...dungeon.tiles[key], z });
    }
  });

  return dungeon;
};
