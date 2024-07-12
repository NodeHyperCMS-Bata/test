export default (session) => {
	function sessionStore(database){
		this.database = database;
	}

	sessionStore.prototype = new session.Store();
	sessionStore.prototype.constructor = sessionStore;

	sessionStore.prototype.get = function(sid, fn){
		let table = this.database.table(sid);

		table.get().then(data => {
			fn && fn(null, data);
		});
	};

	sessionStore.prototype.set = function(sid, sess, fn){
		let table = this.database.table(sid);

		table.set(sess).then(() => {
			fn && fn(null);
		});
	};

	sessionStore.prototype.destroy = function(sid, fn){
		let table = this.database.table(sid);

		table.remove().then(() => {
			fn && fn(null);
		});
	};

	return sessionStore;
};