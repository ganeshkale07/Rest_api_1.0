import Joi from "joi";
import { UserModel } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtToken from "../../services/JwtToken";
import bcrypt from 'bcrypt';

const loginController = {
    
    async login(req,res,next){
        //validate user
        const loginSchema = Joi.object({
            
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })

        const { error } = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }
        //step 2 - verify is it correct user (CHECK email and password )
        let isItRealUser = await UserModel.findOne({ "email" : req.body.email});

        if(!isItRealUser){
            return next(CustomErrorHandler.wrongCredentials());
        }
        
        let result = await bcrypt.compare(req.body.password, isItRealUser.password);

        if(!result){
            return next(CustomErrorHandler.wrongCredentials());
        }

        // step 3 - Generate token now
        let access_token = JwtToken.signToken({_id : isItRealUser._id , role : isItRealUser.role});

        res.json({
            "message" : "logged in sucessfully!",
            "access_token" : access_token})
    }
}

export default loginController;