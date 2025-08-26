import { get, sample, times } from "lodash";
import { grid, pxToCell } from "./lib/canvas";
import "./lib/canvas.js";
import { createDungeon } from "./lib/dungeon";
import { circle, toCell, toLocId } from "./lib/grid";
import
	{
		addCache,
		clearCache,
		deserializeCache,
		readCache,
		readCacheSet,
		serializeCache,
	} from "./state/cache";
import { Ai, IsInFov, Move, Position } from "./state/components";
import ecs from "./state/ecs";
import { Armor, FrostPotion, Goblin, HealthPotion, Player, PoisonPotion, ScrollFireball, StairsDown, StairsUp } from "./state/prefabs.js";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { EffectsSystem } from "./systems/EffectsSystem";
import { FOVSystem } from "./systems/FOVSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { TargetingSystem } from "./systems/TargetingSystem";

export let messageLog = ["", "Welcome to Mini Rogue RL!", ""];
export const addLog = (text) =>
{
	messageLog.unshift(text);
};

const GameStates = {
	GAME: 0,
	INVENTORY: 1,
	TARGETING: 2,
	GAMEOVER: 3
}

const saveGame = () =>
{
	const gameSaveData = {
		ecs: ecs.serialize(),
		cache: serializeCache(),
		playerId: player.id,
		messageLog,
	};
	localStorage.setItem("gameSaveData", JSON.stringify(gameSaveData));
	addLog("Game saved");
};

const loadGame = () =>
{
	const data = JSON.parse(localStorage.getItem("gameSaveData"));
	if (!data)
	{
		addLog("Failed to load - no saved games found");
		return;
	}

	for (let entity of ecs.entities.all)
	{
		entity.destroy();
	}
	clearCache();

	ecs.deserialize(data.ecs);
	deserializeCache(data.cache);

	player = ecs.getEntity(data.playerId);

	userInput = null;
	playerTurn = true;
	gameState = GameStates.GAME;
	selectedInventoryIndex = 0;

	messageLog = data.messageLog;
	addLog("Game loaded");
};

const newGame = () =>
{
	for (let item of ecs.entities.all)
	{
		item.destroy();
	}
	clearCache();

	userInput = null;
	playerTurn = true;
	gameState = GameStates.GAME;
	selectedInventoryIndex = 0;

	messageLog = ["", "Welcome to Gobs 'O Goblins!", ""];

	initGame();
};

const enemiesInFOV = ecs.createQuery({ all: [IsInFov, Ai] });

const createDungeonLevel = ({
	createStairsUp = true,
	createStairsDown = true,
} = {}) =>
{
	const dungeon = createDungeon({
		x: grid.map.x,
		y: grid.map.y,
		z: readCache("z"),
		width: grid.map.width,
		height: grid.map.height,
	});

	const openTiles = Object.values(dungeon.tiles).filter(
		(x) => x.sprite === "FLOOR"
	);

	times(3, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(Goblin).add(Position, tile);
	});

	times(2, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(HealthPotion).add(Position, tile);
	});

	times(1, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(PoisonPotion).add(Position, tile);
	});

	times(1, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(FrostPotion).add(Position, tile);
	});

	times(10, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(Armor).add(Position, tile);
	});

	times(1, () =>
	{
		const tile = sample(openTiles);
		ecs.createPrefab(ScrollFireball).add(Position, tile);
	});

	let stairsUp, stairsDown;

	if (createStairsUp)
	{
		times(1, () =>
		{
			const tile = sample(openTiles);
			stairsUp = ecs.createPrefab(StairsUp);
			stairsUp.add(Position, tile);
		});
	}

	if (createStairsDown)
	{
		times(1, () =>
		{
			const tile = sample(openTiles);
			stairsDown = ecs.createPrefab(StairsDown);
			stairsDown.add(Position, tile);
		});
	}

	return { dungeon, stairsUp, stairsDown };
};

const goToDungeonLevel = (level) =>
{
	const goingUp = readCache("z") < level;
	const floor = readCache("floors")[level];

	if (floor)
	{
		addCache("z", level);
		player.remove(Position);
		if (goingUp)
		{
			player.add(Position, toCell(floor.stairsDown));
		} else
		{
			player.add(Position, toCell(floor.stairsUp));
		}
	} else
	{
		addCache("z", level);
		const { stairsUp, stairsDown } = createDungeonLevel();

		addCache(`floors.${level}`, {
			stairsUp: toLocId(stairsUp.position),
			stairsDown: toLocId(stairsDown.position),
		});

		player.remove(Position);

		if (goingUp)
		{
			player.add(Position, toCell(stairsDown.position));
		} else
		{
			player.add(Position, toCell(stairsUp.position));
		}
	}

	FOVSystem(player);
	RenderSystem(player);
};

const initGame = () =>
{
	const { stairsDown } = createDungeonLevel({ createStairsUp: false });

	player = ecs.createPrefab(Player);

	addCache(`floors.${-1}`, {
		stairsDown: toLocId(stairsDown.position),
	});

	player.add(Position, stairsDown.position);

	FOVSystem(player);
	RenderSystem(player);
};

let player = {};
let userInput = null;
let playerTurn = true;
export let gameState = GameStates.GAME;
export let selectedInventoryIndex = 0;

initGame();

document.addEventListener("keydown", (ev) =>
{
	if (ev.key !== "Shift")
	{
		userInput = ev.key;
	}
});

const processUserInput = () =>
{
	if (userInput === "l")
	{
		loadGame();
	}

	if (userInput === "n")
	{
		newGame();
	}

	if (userInput === "s")
	{
		saveGame();
	}

	if (gameState === GameStates.GAME)
	{
		if (userInput === ">")
		{
			if (
				toLocId(player.position) ==
				readCache(`floors.${readCache("z")}.stairsDown`)
			)
			{
				addLog("You descend deeper into the dungeon");
				goToDungeonLevel(readCache("z") - 1);
			} else
			{
				addLog("There are no stairs to descend");
			}
		}

		if (userInput === "<")
		{
			if (
				toLocId(player.position) ==
				readCache(`floors.${readCache("z")}.stairsUp`)
			)
			{
				addLog("You climb from the depths of the dungeon");
				goToDungeonLevel(readCache("z") + 1);
			} else
			{
				addLog("There are no stairs to climb");
			}
		}

		if (userInput === "ArrowUp")
		{
			player.add(Move, { x: 0, y: -1, z: readCache("z") });
		}
		if (userInput === "ArrowRight")
		{
			player.add(Move, { x: 1, y: 0, z: readCache("z") });
		}
		if (userInput === "ArrowDown")
		{
			player.add(Move, { x: 0, y: 1, z: readCache("z") });
		}
		if (userInput === "ArrowLeft")
		{
			player.add(Move, { x: -1, y: 0, z: readCache("z") });
		}
		if (userInput === "t")
		{
			let pickupFound = false;
			readCacheSet("entitiesAtLocation", toLocId(player.position)).forEach(
				(eId) =>
				{
					const entity = ecs.getEntity(eId);
					if (entity.isPickup)
					{
						pickupFound = true;
						player.fireEvent("pick-up", entity);
						addLog(`You pickup a ${entity.description.name}`);
					}
				}
			);
			if (!pickupFound)
			{
				addLog("There is nothing to pick up here");
			}
		}
		if (userInput === "i")
		{
			gameState = GameStates.INVENTORY;
		}

		// if (userInput === "z") {
		//   gameState = GameStates.TARGETING;
		// }

		userInput = null;
	}

	if (gameState === GameStates.TARGETING)
	{
		if (userInput === "z" || userInput === "Escape")
		{
			gameState = GameStates.GAME;
		}

		userInput = null;
	}

	if (gameState === GameStates.INVENTORY)
	{
		if (userInput === "i" || userInput === "Escape")
		{
			gameState = GameStates.GAME;
		}

		if (userInput === "ArrowUp")
		{
			selectedInventoryIndex -= 1;
			if (selectedInventoryIndex < 0) selectedInventoryIndex = 0;
		}

		if (userInput === "ArrowDown")
		{
			selectedInventoryIndex += 1;
			if (selectedInventoryIndex > player.inventory.list.length - 1)
				selectedInventoryIndex = player.inventory.list.length - 1;
		}

		if (userInput === "d")
		{
			if (player.inventory.list.length)
			{
				addLog(`You drop a ${player.inventory.list[0].description.name}`);
				player.fireEvent("drop", player.inventory.list[0]);
			}
		}

		if (userInput === "r") 
		{
			const entity = player.inventory.list[selectedInventoryIndex];
			if (entity && entity.has("Consumable") && entity.get("Consumable").isReadable) 
			{
				if (entity.requiresTarget) 
				{
					if (entity.requiresTarget.acquired === "RANDOM") 
					{
						// get a target that is NOT the player
						const target = sample([...enemiesInFOV.get()]);

						if (target) 
						{
							player.add("TargetingItem", { item: entity });
							player.add("Target", { locId: toLocId(target.position) });
						} else {
							addLog(`The scroll disintegrates uselessly in your hand`);
							entity.destroy();
						}
					}

					if (entity.requiresTarget.acquired === "MANUAL") 
					{
						player.add("TargetingItem", { item: entity });
						gameState = GameStates.TARGETING;
						return;
					}
				} else if (entity.has("Effects")) 
				{
					// clone all effects and add to self
					entity
						.get("Effects")
						.forEach((x) => player.add("ActiveEffects", { ...x.serialize() }));

					addLog(`The effects are felt immediately`);
					entity.destroy();
				}

				if (selectedInventoryIndex > player.inventory.list.length - 1)
				{
					selectedInventoryIndex = Math.max(0, player.inventory.list.length - 1);
				}

				gameState = GameStates.GAME;
			}
		}

		if (userInput === "c")
		{
			const entity = player.inventory.list[selectedInventoryIndex];

			if (entity && entity.has("Consumable") && entity.get("Consumable").isDrinkable)
			{
				if (entity.requiresTarget)
				{
					if (entity.requiresTarget.acquired === "RANDOM")
					{
						// get a target that is NOT the player
						const target = sample([...enemiesInFOV.get()]);

						if (target)
						{
							player.add("TargetingItem", { item: entity });
							player.add("Target", { locId: toLocId(target.position) });
						} else
						{
							addLog(`You fail to throw the potion`);
							entity.destroy();
						}
					}

					if (entity.requiresTarget.acquired === "MANUAL")
					{
						player.add("TargetingItem", { item: entity });
						gameState = GameStates.TARGETING;
						return;
					}
				} else if (entity.has("Effects"))
				{
					// clone all effects and add to self
					entity
						.get("Effects")
						.forEach((x) => player.add("ActiveEffects", { ...x.serialize() }));

					addLog(`You drank a ${entity.description.name}`);
					entity.destroy();
				}

				if (selectedInventoryIndex > player.inventory.list.length - 1)
				{
					selectedInventoryIndex = Math.max(0, player.inventory.list.length - 1);
				}

				gameState = GameStates.GAME;
			}
		}

		userInput = null;
	}
};

const update = () =>
{
	AnimationSystem();

	if (player.isDead)
	{
		if (gameState !== GameStates.GAMEOVER)
		{
			addLog("You are dead.");
			RenderSystem(player);
		}
		gameState = GameStates.GAMEOVER;
		processUserInput();
		return;
	}

	if (playerTurn && userInput && gameState === GameStates.TARGETING)
	{
		processUserInput();
		RenderSystem(player);
		playerTurn = true;
	}

	if (playerTurn && userInput && gameState === GameStates.INVENTORY)
	{
		processUserInput();
		TargetingSystem();
		EffectsSystem();
		RenderSystem(player);
		playerTurn = true;
	}

	if (playerTurn && userInput && gameState === GameStates.GAME)
	{
		processUserInput();
		EffectsSystem();
		MovementSystem();
		FOVSystem(player);
		RenderSystem(player);

		if (gameState === GameStates.GAME)
		{
			playerTurn = false;
		}
	}

	if (!playerTurn)
	{
		AISystem(player);
		// EffectsSystem();
		MovementSystem();
		FOVSystem(player);
		RenderSystem(player);

		playerTurn = true;
	}
};

const gameLoop = () =>
{
	update();
	requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

const canvas = document.querySelector("#canvas");

canvas.onclick = (e) =>
{
	const [x, y] = pxToCell(e);
	const locId = toLocId({ x, y, z: readCache("z") });

	readCacheSet("entitiesAtLocation", locId).forEach((eId) =>
	{
		const entity = ecs.getEntity(eId);

		// Only do this during development
		if (process.env.NODE_ENV === "development")
		{
			console.log(
				`${get(entity, "appearance.char", "?")} ${get(
					entity,
					"description.name",
					"?"
				)}`,
				entity.serialize()
			);
		}

		if (gameState === GameStates.TARGETING)
		{
			const entity = player.inventory.list[selectedInventoryIndex];
			if (entity.requiresTarget.aoeRange)
			{
				const targets = circle({ x, y }, entity.requiresTarget.aoeRange).map(
					(locId) => `${locId},${readCache("z")}`
				);
				targets.forEach((locId) => player.add("Target", { locId }));
			} else
			{
				player.add("Target", { locId });
			}

			gameState = GameStates.GAME;
			TargetingSystem();
			EffectsSystem();
			RenderSystem(player);
		}
	});
};
