import { remove } from "lodash";
import { Component } from "geotic";
import { addCacheSet, deleteCacheSet } from "./cache";

export class IsLiveBeing extends Component { }
export class IsBlocking extends Component { }
export class IsDead extends Component { }
export class IsInFov extends Component { }
export class IsOpaque extends Component { }
export class IsPickup extends Component { }
export class IsRevealed extends Component { }
export class Layer100 extends Component { }
export class Layer300 extends Component { }
export class Layer400 extends Component { }

const effectProps = {
	component: "",
	delta: "",
	animate: { char: "", color: "" },
	events: [], // { name: "", args: {} },
	addComponents: [], // { name: '', properties: {} }
	duration: 0, // in turns
};

export class ActiveEffects extends Component {
	static allowMultiple = true;
	static properties = effectProps;
}

export class Ai extends Component { }

export class Animate extends Component {
	static allowMultiple = true;
	static properties = {
		startTime: null,
		duration: 500,
		char: "",
		color: "",
	};

	onSetStartTime(evt) {
		this.startTime = evt.data.time;
	}
}

export class Appearance extends Component {
	static properties = {
		color: "#ff0077",
		char: "?",
		background: "#000",
		isIcon: false
	};
}

export class Consumable extends Component
{
	static properties = {
		isDrinkable: false,
		isReadable: false,
		isWearable: false,
	}
}

export class Defense extends Component {
	static properties = { max: 4, current: 0 };
}

export class Description extends Component {
	static properties = { name: "No Name" };
}

export class Effects extends Component {
	static allowMultiple = true;
	static properties = effectProps;
}

export class Experience extends Component {
	static properties = { max: 20, current: 0 };
}

export class Health extends Component {
	static properties = { max: 10, current: 10 };

	onTakeDamage(evt) {
		this.current -= evt.data.amount;

		if (this.current <= 0) {
			this.entity.appearance.char = "%";
			
			if (this.entity.has("Ai")) 
			{
				this.entity.remove("Ai");
			}

			if (this.entity.has("IsLiveBeing")) 
			{
				this.entity.remove("IsLiveBeing");
			}

			this.entity.remove("IsBlocking");
			this.entity.add("IsDead");
			
			this.entity.remove("Layer400");
			this.entity.add("Layer300");
		}

		evt.handle();
	}
}

export class Inventory extends Component {
	static properties = {
		list: "<EntityArray>",
	};

	onPickUp(evt) {
		this.list.push(evt.data);

		if (evt.data.position) {
			evt.data.remove("Position");
		}
	}

	onDrop(evt) {
		remove(this.list, (x) => x.id === evt.data.id);
		evt.data.add("Position", this.entity.position);
	}
}



export class Move extends Component {
	static properties = { x: 0, y: 0, z: 0, relative: true };
}

export class Paralyzed extends Component { }
export class Frosted extends Component { }
export class Poisoned extends Component { 
	static properties = { damage: 1, onlyAppliesTo: ["IsLiveBeing"] };
}

export class Position extends Component {
	static properties = { x: 0, y: 0, z: -1 };

	onAttached() {
		const locId = `${this.entity.position.x},${this.entity.position.y},${this.entity.position.z}`;
		addCacheSet("entitiesAtLocation", locId, this.entity.id);
	}

	onDetached() {
		const locId = `${this.x},${this.y},${this.z}`;
		deleteCacheSet("entitiesAtLocation", locId, this.entity.id);
	}
}

export class Power extends Component {
	static properties = { max: 5, current: 3 };
}

export class RequiresTarget extends Component {
	static properties = {
		acquired: "RANDOM",
		aoeRange: 0,
	};
}

export class Target extends Component {
	static allowMultiple = true;
	static properties = { locId: "" };
}

export class TargetingItem extends Component {
	static properties = { item: "<Entity>" };
}
