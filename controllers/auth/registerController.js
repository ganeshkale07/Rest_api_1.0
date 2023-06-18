import Joi from "joi";
import { UserModel } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtToken from "../../services/JwtToken";

const registerController = {
        async resolveReq(req, res, next){
            //step 1 - validation
            const schema = Joi.object({
                username: Joi.string().min(3).max(30).required(),

                password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

                repeat_password: Joi.ref('password'),

                email: Joi.string().email().required()
            })

             const {error } = schema.validate(req.body);
            if(error) {
                //Cannot use 
                //if function is async the error handler middleware won't trigger 
                //throw error;
                return next(error);
            }

            //step 2 - Check if user already exist
            //Using try catch 
            //there is possibility operation db give error like while exists()
            try{
                const userExist = await UserModel.exists({email : req.body.email});
                if(userExist){
                    return next(CustomErrorHandler.userAlreadyExist("Entered User alreaday exist!"));
                }
            }catch(error){
                return next(error);
            }

            //Step 3 - insert user into DB
            const {username , password , email} = req.body;

            const hashedPassword = await bcrypt.hash(password,+10);
            let user = new UserModel({
                username,
                password : hashedPassword,
                email
            })
            let access_token;
            try{
                let result = await user.save();
                //create JWT token
                access_token = JwtToken.signToken({_id: result._id , role : result.role});
                res.json({"access_token" : access_token});
                
            }catch(error){
                next(error);
            }
            

            
        }
}

export default registerController;