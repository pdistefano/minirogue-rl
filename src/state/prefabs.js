// Base
export const Tile = {
	name: "Tile",
	components: [
		{ type: "Appearance" },
		{ type: "Description" },
		{ type: "Layer100" },
	],
};

export const Being = {
	name: "Being",
	components: [
		{ type: "Appearance" },
		{ type: "Defense" },
		{ type: "Description" },
		{ type: "Health" },
		{ type: "IsBlocking" },
		{ type: "Layer400" },
		{ type: "Power" },
	],
};

export const Item = {
	name: "Item",
	components: [
		{ type: "Appearance" },
		{ type: "Description" },
		{ type: "Layer300" },
		{ type: "IsPickup" },
	],
};

// Complex
export const HealthPotion = {
	name: "HealthPotion",
	inherit: ["Item"],
	components: [
		{
			type: "Appearance",
			properties: { char: "♥", color: "#C84D4A" },
		},
		{
			type: "Description",
			properties: { name: "health potion" },
		},
		{
			type: "Effects",
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
			type: "Appearance",
			properties: { char: "p", color: "#68A85E" },
		},
		{
			type: "Description",
			properties: { name: "poison potion" },
		},
		{
			type: "Effects",
			properties: {
				animate: { color: "#68A85E"},
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
			type: "RequiresTarget",
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
			type: "Appearance",
			properties: { char: "F", color: "#64ABAA" },
		},
		{
			type: "Description",
			properties: { name: "frost potion" },
		},
		{
			type: "Effects",
			properties: {
				animate: { color: "#64ABAA"},
				addComponents: [
					{
						name: "Paralyzed",
						properties: {},
					},
				],
				duration: 5,
			}
		},
		{ type: "RequiresTarget", properties: { acquired: "MANUAL" } },
	],
};


export const ScrollLightning = {
	name: "ScrollLightning",
	inherit: ["Item"],
	components: [
		{
			type: "Appearance",
			properties: { char: "L", color: "#6600BF" },
		},
		{
			type: "Description",
			properties: { name: "scroll of lightning" },
		},
		{
			type: "Effects",
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
		{ type: "RequiresTarget", properties: { acquired: "RANDOM" } },
	],
};

export const ScrollFireball = {
	name: "ScrollFireball",
	inherit: ["Item"],
	components: [
		{
			type: "Appearance",
			properties: { char: "F", color: "#F2653E" },
		},
		{
			type: "Description",
			properties: { name: "scroll of fireball" },
		},
		{
			type: "Effects",
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
			type: "RequiresTarget",
			properties: {
				acquired: "MANUAL",
				aoeRange: 3,
			},
		},
	],
};

export const Wall = {
	name: "Wall",
	inherit: ["Tile"],
	components: [
		{ type: "IsBlocking" },
		{ type: "IsOpaque" },
		{
			type: "Appearance",
			properties: { char: "#", color: "#AAA" },
		},
		{
			type: "Description",
			properties: { name: "wall" },
		},
	],
};

export const Floor = {
	name: "Floor",
	inherit: ["Tile"],
	components: [
		{
			type: "Appearance",
			properties: { char: "•", color: "#333" },
		},
		{
			type: "Description",
			properties: { name: "floor" },
		},
	],
};

export const StairsUp = {
	name: "StairsUp",
	inherit: ["Tile"],
	components: [
		{
			type: "Appearance",
			properties: { char: "<", color: "#AAA" },
		},
		{
			type: "Description",
			properties: { name: "set of stairs leading up" },
		},
	],
};

export const StairsDown = {
	name: "StairsDown",
	inherit: ["Tile"],
	components: [
		{
			type: "Appearance",
			properties: { char: ">", color: "#AAA" },
		},
		{
			type: "Description",
			properties: { name: "set of stairs leading down" },
		},
	],
};

export const Player = {
	name: "Player",
	inherit: ["Being"],
	components: [
		{
			type: "Appearance",
			properties: { char: "@", color: "#FFF" },
		},
		{
			type: "Description",
			properties: { name: "You" },
		},
		{ type: "Inventory" },
	],
};

export const Goblin = {
	name: "Goblin",
	inherit: ["Being"],
	components: [
		{ type: "Ai" },
		{
			type: "Appearance",
			properties: { char: "g", color: "green" },
		},
		{
			type: "Description",
			properties: { name: "goblin" },
		},
	],
};

export const Dummy = {
	name: "Dummy",
	inherit: ["Being"],
	components: [
		{
			type: "Appearance",
			properties: { char: "d", color: "white" },
		},
		{
			type: "Description",
			properties: { name: "dummy" },
		},
	],
};
