export const GameStates = 
{
	GAME: 0,
	INVENTORY: 1,
	TARGETING: 2,
	GAMEOVER: 3
}

export const LocalStorageKeys = 
{
	SAVE: "gameSaveData",
}

export const Caches =
{
	Z: "z",
	FLOORS: "floors"
}

export const UserInput = 
{
	ArrowUp: "ArrowUp",
	ArrowRight: "ArrowRight",
	ArrowDown: "ArrowDown",
	ArrowLeft: "ArrowLeft",
	Escape: "Escape",

	KeyL: "l",
	KeyN: "n",
	KeyS: "s",
	KeyGT: ">",
	KeyLT: "<",
	KeyD: "d",
	KeyI: "i",
	KeyT: "t",
	KeyZ: "z",
}

export const TargetTypes =
{
	MANUAL: "MANUAL",
	RANDOM: "RANDOM"
}

export const Events =
{
	PickUp: "pick-up",
	Drop: "drop",
	SetStartTime: "set-start-time",
	TakeDamage: "take-damage"
}