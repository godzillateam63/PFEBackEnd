const userModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
module.exports.getAllUser= async (req,res) =>{
    const users = await userModel.find().select('-password');
    res.status(200).json(users);

}
//one user
module.exports.userInfo= async (req,res) =>{
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);

    userModel.findById(req.params.id, (err,data)=>{
        if(!err)
            res.send(data);
        else
            console.log('ID unknow : '+err);

    }).select('-password');


}
module.exports.updateUser= async (req,res) =>{
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : '+ req.params.id);
    try {
        await userModel.findByIdAndUpdate(
            {_id:req.params.id},
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,

                }
            },
            {new: true, upsert: true, setDefaultsOnInsert:true},
            (err,data) =>{
                if (!err) return res.send(data);
                if (err) return  res.status(500).send({message: err});
            }
        )
    }catch(err) {

        return res.status(500).json({message: err});
    }

}


module.exports.DeleteUser = async (req,res)=>{
 if (!ObjectID.isValid(req.params.id))
     return res.status(400).send('ID unknown '+req.params.id);
 try {
     await userModel.remove({_id:req.params.id})
     res.status(200).json({message: "succes deleted"});

 }catch (err)
 {
     return res.status(500).json({message: err});

 }
}

































