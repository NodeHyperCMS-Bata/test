export let vars = {};

export let save = {
	save: (name, value) => {
		return (vars[name] = value);
	},
	load: (name) => {
		return vars[name];
	}
};

export default save;