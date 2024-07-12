export let vars = {};

export let event = {
	on: (name, fun) => {
		process.on(`nodejsCMSevent_${name}`, fun);
	},
	emit: (name, ...param) => {
		process.emit(`nodejsCMSevent_${name}`, ...param);
	}
};

export default event;