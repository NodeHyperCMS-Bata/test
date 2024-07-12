import path from "path";

export {path};

export function rootDir(...dirs){
	let dir = process.cwd();
	dirs.forEach(element => {
		dir = path.join(dir, element);
	});
	return dir;
}