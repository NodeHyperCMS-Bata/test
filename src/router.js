import express from "express";
import path from "path";

export {express};

export function Router(){
	const router = express.Router();

	router.server = (path, ...cb) => {
		router.all(path, ...cb);
	};

	router.receive = (dir, ...cb) => {
		dir = path.normalize(dir);

		router.server(dir.replace(/\\/g, '/'), ...cb);
		
		if(path.extname(dir) == ''){
			router.server(path.join(dir.replace(/\\/g, '/'), 'index.php'), ...cb);
		}
	};

	return router;
}

export default Router;