import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getPlants, getPlantsPub } from "./database/plants";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";
import httpContext from "express-http-context";
require("dotenv").config();

export interface IUser {
    sub: string;
}
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));
app.use(httpContext.middleware);

app.get("/pub", async (req, res) => {
    res.send(await getPlantsPub());
});
app.post("/pub", async (req, res) => {
    res.send({ hello: "world" });
});

console.log(process.env.SECRET_PASSWORD);
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URL,
    }),

    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER,
    algorithms: ["RS256"],
});

const fetchUserData = async function (req: any, res: any, next: any) {
    const accessToken = req.headers.authorization.split(" ")[1];
    try {
        const userInfoResponse = await axios.get(process.env.USERINFORESPONSE, {
            headers: {
                Authorization: req.headers.authorization,
            },
        });

        httpContext.set("user", {
            ...userInfoResponse.data,
            accessToken,
        });
    } catch (e) {
        // assume tester in dev mode
        // TODO: add dev env
        httpContext.set("user", {
            sub: "dev_tester",
            accessToken,
        });
    }

    next();
};

app.use(checkJwt);
app.use(fetchUserData);

app.get("/", async (req, res) => {
    res.send(await getPlants());
});

// starting the server
app.listen(3001, () => {
    console.log("listening on port 3001");
});
