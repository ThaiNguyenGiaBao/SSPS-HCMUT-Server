"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorRespone_1 = require("../helper/errorRespone");
const initDatabase_1 = __importDefault(require("../dbs/initDatabase"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AccessService {
    static SignUp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, username, password }) {
            if (!email || !username || !password) {
                throw new errorRespone_1.BadRequestError("Email and username are required");
            }
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                throw new errorRespone_1.BadRequestError("Username must be alphanumeric and not contains space");
            }
            //const query = 'SELECT * FROM '
            // Check if the user already exists
            const userResult = yield initDatabase_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            if (userResult.rows.length > 0) {
                throw new errorRespone_1.BadRequestError("User already exists");
            }
            const avatarUrl = "https://avatar.iran.liara.run/username?username=" + username;
            // hash the password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create a new user
            const newUserResult = yield initDatabase_1.default.query(`INSERT INTO users (email, username, password, isAdmin, avatarUrl) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`, [email, username, hashedPassword, false, avatarUrl]);
            const newUser = newUserResult.rows[0];
            console.log("New user", newUser);
            return {
                user: newUser
            };
        });
    }
    static SignIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            if (!email || !password) {
                throw new errorRespone_1.BadRequestError("Email and password are required");
            }
            const userResult = yield initDatabase_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = userResult.rows[0];
            if (!user) {
                throw new errorRespone_1.NotFoundError("User not found");
            }
            if (yield bcrypt_1.default.compare(password, user.password)) {
                const accessToken = jsonwebtoken_1.default.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || "secret");
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                return Object.assign(Object.assign({}, userWithoutPassword), { accessToken });
            }
            else {
                throw new errorRespone_1.ForbiddenError("Invalid password");
            }
        });
    }
}
exports.default = AccessService;