module.exports.singUpErrors = (err)=>{

    let errors = {firstname:'',email:'',password:''}; 
    if (err.message.includes('firstname'))
        errors.firstname="firstname incorrect ";
    if (err.message.includes('email'))
        errors.email="Email incorrect ";
    if (err.message.includes('password'))
        errors.password = "le mot de passe doit faire 6 caractères minimum";
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes(("firstname")))
        errors.firstname="cette firstname est deja pris";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes(("email")))
        errors.email="cette email est deja enregistre";

    return errors;

}
module.exports.singInErrors = (err) =>{
 let errors = {email:'',password:''}
 if(err.message.includes("email"))
     errors.email="email inconnu";
 if(err.message.includes("password"))
     errors.password="le mot de passe ne correspond pas";
 return errors;





}
