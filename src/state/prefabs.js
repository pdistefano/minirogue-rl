import
	{
		Ai,
		Appearance,
		Consumable,
		Defense,
		Description,
		Effects,
		Experience,
		Health,
		Inventory,
		IsBlocking,
		IsLiveBeing,
		IsOpaque,
		IsPickup,
		Layer100,
		Layer300,
		Layer400,
		Power,
		RequiresTarget
	} from "./components";

// Base
export const Tile = {
	name: "Tile",
	components: [
		{ type: Appearance },
		{ type: Description },
		{ type: Layer100 },
	],
};

export const Being = {
	name: "Being",
	components: [
		{ type: Appearance },
		{ type: Defense },
		{ type: Description },
		{ type: Health },
		{ type: IsBlocking },
		{ type: Layer400 },
		{ type: Power },
		{ type: IsLiveBeing },
	],
};

export const Item = {
	name: "Item",
	components: [
		{ type: Appearance },
		{ type: Description },
		{ type: Layer300 },
		{ type: IsPickup },
	],
};

// Complex
export const HealthPotion = {
	name: "HealthPotion",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "H", isIcon: true, color: "#C84D4A" },
		},
		{
			type: Consumable,
			properties: { isDrinkable: true },
		},
		{
			type: Description,
			properties: { name: "health potion" },
		},
		{
			type: Effects,
			properties: {
				component: "health",
				delta: 5,
				animate: { color: "#C84D4A", char: "♥" },
			},
		},
	],
};

export const PoisonPotion = {
	name: "PoisonPotion",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "p", color: "#68A85E", isIcon: true },
		},
		{
			type: Consumable,
			properties: { isDrinkable: true },
		},
		{
			type: Description,
			properties: { name: "poison potion" },
		},
		{
			type: Effects,
			properties: {
				animate: { color: "#68A85E", duration: 1000 },
				addComponents: [
					{
						name: "Poisoned",
						properties: {
							damage: 3,
						},
					},
				],
				duration: 99,
			},
		},
		{
			type: RequiresTarget,
			properties: {
				acquired: "MANUAL",
			},
		},
	],
};

export const FrostPotion = {
	name: "FrostPotion",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "8", color: "#64ABAA", isIcon: true },
		},
		{
			type: Consumable,
			properties: { isDrinkable: true },
		},
		{
			type: Description,
			properties: { name: "frost potion" },
		},
		{
			type: Effects,
			properties: {
				animate: { color: "#64ABAA", duration: 1000 },
				addComponents: [
					{
						name: "Paralyzed",
						properties: {},
					},
					{
						name: "Frosted",
						properties: {},
					},
				],
				duration: 5,
			},
		},
		{ type: RequiresTarget, properties: { acquired: "MANUAL" } },
	],
};


export const ScrollLightning = {
	name: "ScrollLightning",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "C", color: "#6600BF", isIcon: true },
		},
		{
			type: Consumable,
			properties: { isReadable: true },
		},
		{
			type: Description,
			properties: { name: "scroll of lightning" },
		},
		{
			type: Effects,
			properties: {
				animate: { color: "#6600BF" },
				events: [
					{
						name: "take-damage",
						args: { amount: 25 },
					},
				],
			},
		},
		{ type: RequiresTarget, properties: { acquired: "RANDOM" } },
	],
};

export const ScrollFireball = {
	name: "ScrollFireball",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "7", color: "#F2653E", isIcon: true },
		},
		{
			type: Consumable,
			properties: { isReadable: true },
		},
		{
			type: Description,
			properties: { name: "scroll of fireball" },
		},
		{
			type: Effects,
			properties: {
				animate: { color: "#F2653E", char: "^" },
				events: [
					{
						name: "take-damage",
						args: { amount: 25 },
					},
				],
			},
		},
		{
			type: RequiresTarget,
			properties: {
				acquired: "MANUAL",
				aoeRange: 3,
			},
		},
	],
};

export const Armor = {
	name: "Armor",
	inherit: ["Item"],
	components: [
		{
			type: Appearance,
			properties: { char: "a", color: "gray", isIcon: true },
		},
		{
			type: Description,
			properties: { name: "piece of armor" },
		},
		{
			type: Consumable,
			properties: { isWearable: true },
		},
		{
			type: Effects,
			properties: {
				component: "defense",
				delta: 1,
				animate: { color: "gray", isIcon:true, char: "a" },
			},
		},
	],
};

export const Wall = {
	name: "Wall",
	inherit: ["Tile"],
	components: [
		{ type: IsBlocking },
		{ type: IsOpaque },
		{
			type: Appearance,
			properties: { char: "▓", color: "#AAA" },
		},
		{
			type: Description,
			properties: { name: "wall" },
		},
	],
};

export const Floor = {
	name: "Floor",
	inherit: ["Tile"],
	components: [
		{
			type: Appearance,
			properties: { char: ".", color: "#333" },
		},
		{
			type: Description,
			properties: { name: "floor" },
		},
	],
};

export const StairsUp = {
	name: "StairsUp",
	inherit: ["Tile"],
	components: [
		{
			type: Appearance,
			properties: { char: "_", color: "#AAA", isIcon: true },
		},
		{
			type: Description,
			properties: { name: "set of stairs leading up" },
		},
	],
};

export const StairsDown = {
	name: "StairsDown",
	inherit: ["Tile"],
	components: [
		{
			type: Appearance,
			properties: { char: "_", color: "#AAA", isIcon: true },
		},
		{
			type: Description,
			properties: { name: "set of stairs leading down" },
		},
	],
};

export const Player = {
	name: "Player",
	inherit: ["Being"],
	components: [
		{
			type: Appearance,
			properties: { char: "@", color: "#FFF", isIcon: false },
		},
		{
			type: Description,
			properties: { name: "You" },
		},
		{
			type: Power,
			properties: {
				current: 4,
				max: 5,
			},
		},
		{
			type: Defense,
			properties: {
				current: 0,
				max: 4,
			},
		},
		{ type: Experience },
		{ type: Inventory },
	],
};

export const Goblin = {
	name: "Goblin",
	inherit: ["Being"],
	components: [
		{ type: Ai },
		{
			type: Appearance,
			properties: { char: "g", color: "green" },
		},
		{
			type: Description,
			properties: { name: "goblin" },
		},
		{
			type: Power,
			properties: {
				current: 2,
				max: 2,
			},
		},
		{
			type: Defense,
			properties: {
				current: 0,
				max: 1,
			},
		}
	],
};

export const Dummy = {
	name: "Dummy",
	inherit: ["Being"],
	components: [
		{
			type: Appearance,
			properties: { char: "d", color: "white" },
		},
		{
			type: Description,
			properties: { name: "dummy" },
		},
	],
};
