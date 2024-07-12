import fs from "fs";

function reset(){
	fs.unlinkSync(process.cwd() + '/config.js');
}

export default reset;