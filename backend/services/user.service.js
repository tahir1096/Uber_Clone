import userModel from "../models/user.model.js";
const createUser = async ({
    firstname,
    lastname,
    email,
    password
}) => {
    if(!firstname || !password || !email) {
        throw new Error("All fields are required");
    }
    const user = await userModel.create({
        firstname,
        lastname,
        email,
        password
    });
    return user;
}

export default {
    createUser,
};
