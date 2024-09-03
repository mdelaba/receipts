import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

//Tell typescript that request may have a property called currentUser
declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
            session?: any;
        }
    }
}

@Injectable()
export class GenerateTokenMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}; //Create empty object if user does not yet have a session object

        if (userId) {
            const user = await this.usersService.fetchUser(userId);
            req.currentUser = user;
        }

        next(); //Go on to run next middleware
    }
}