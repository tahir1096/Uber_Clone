import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// TTL index: documents expire 24 hours after `createdAt`
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

// Static helper to add a token to the blacklist
blacklistTokenSchema.statics.blacklist = async function (token) {
	try {
		return await this.create({ token });
	} catch (err) {
		// ignore duplicate key error (token already blacklisted)
		if (err.code === 11000) return null;
		throw err;
	}
};

const BlacklistToken = mongoose.model("blacklistToken", blacklistTokenSchema);
export default BlacklistToken;
