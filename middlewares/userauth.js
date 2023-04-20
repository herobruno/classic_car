
//Middleware para impedir que o usuario acesse uma rota caso não esteja logado
function userauth (req , res , next){
    if (req.session.user != undefined){
       next();

   }else{
      res.redirect("/cadastro");
    }
}
module.exports = userauth;