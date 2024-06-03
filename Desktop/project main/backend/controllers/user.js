const bcrypt  =  require('bcrypt');
// const User =  require('../models/UserModel');
const UserModel = require('../models/UserModel');
const jwt =  require("jsonwebtoken");
const { options } = require('../routes/user');

// ab jhme env laana hai 
require("dotenv").config();




// signup route  handler 
exports.signup  =  async (req , res) => {
    try {
        //get data 
        const {name , email ,  password , role} = req.body;

        // ye saara ka saara requrst ki body mein se nikal lo 


        // check if user already exits 
        const existingUser  = await UserModel.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already exist',
            })
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword  = await bcrypt.hash(password  ,10);

            // issse ham password ko hash krr paayenge 
        }
        catch(err){
            return res.status(500).json({
                success:false, 
                message:'error in hashing password'
            })
        }

        // what is retty strategy and how to apply in express project

        // create entry for user 
        const user  =  await  UserModel.create({
            name , email , password:hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message:'User Created succesfully',
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false ,
            message: 'Error in hashing Password',
        });
        
    }
}








//login 
exports.login   =   async (req , res) => {
    try {
        //data fetch krenege 
        const {email , password} =   req.body;
        // validation on mail and password 
        if (!email||!password) {
            return res.status(400).json({
                success:false ,
                message:"Please fil all the details carefully"
            })
            
        }

        // cjeck avaialability of user 

        const user  =  await UserModel.findOne({email})
        // if not a registered user 
        if (!user) {
            return res.status(401).json({
                success: false ,
                message: 'USer is not registered',
            })
        }

        // verufy password and generate a jwt token 

        // bcrypt library ka ek compare funvction jisse ha password comparee krr skenege 


// payload 
const payload =  {
    email:user.email,
    id:user._id,
    role:user.role,
}



        if (await bcrypt.compare(password, user.password)) {

            // password match krr gyi  to 
            // pehla ham to login karenge 
            // aur dusra ki jwt token create krenge 

            let token  =  jwt.sign(payload , process.env.JWT_SECRET,

                // note  expires in jo hai wo uska original function hai jiska mtylb hota hai kitne tym baad expire ho jaayega 
                {
                    expiresIn:"2h",
                }
            )

            // token created   ab ham ek aur kaam krenge jaise ki 
            // jo user hamare paas bana tha ussi mein isse daal denge ab 

            user = user.toObject();
            user.token = token;

            // ab yhan ek baat batao agr ham user ka object send karein to usmein to password bhi hai to kya mtlb kis password bhi chala jaayega naaa naa ye to krna hi nai hai  bhaot bada bewakufi hai ismein to to isse bachne ke liuye ham kya karenge 

            // aisa kuch 
            user.password = undefined ;
            // dhyaan rhe ye cheez ki ye ham user user objct mein se hataye ain na ki database mein se 

            // ab cookie mein send krr denge 
            // ab cookie ke andar teen cheez paas krna hota hai 
            // 1) cookie ka naam 
            // 2)  cookie ka data 
            // 3)  kuch options like cokie kab expire hogi chnages uske aur bhi different options 
                 const options  =  {

                    expires: new Date(Date.now()+ 3*24*60*60*1000 )
                // itne milli seconds that is 3 days 


                 , HttpOnly
                //  isse bass kuch nahi client side prr hame nai milega access nai krr paayenge 



                 }
                 


// ab isss cookie ko as an respons send krr diya auf woth uske statua 
            res.cookie("AdityaCookie" ,   token  ,  options).status(200).json({
                success:true  ,
                token,
                user ,
                message:'User logged in succesfully'
            });



            
        }
        else{
            //apssword donot match 
            return res.status(403).json({
                success:false ,
                message:"Password Incorrect" 
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false ,
            message:"Login FAilure"
        })
        
    }
}
