const templateResetPassword = (token) => {
  return view = `
    <div style="text-align: center;height: 200px;">
      <h2 style="color:black;">Confirmar registro</h2>
      <p style="color:black;font-size:14px;">Confirmar usuario para disfrutar del contenido</p>
      <a href="http://localhost:3000/register/${token}" target:"_blank" style="color:white;text-decoration:none;font-size:20px;border:1px solid black;border-radius:10px;padding-left:40px;padding-right:40px;padding-top:5px;padding-bottom:5px;text-align:center;background:rgb(43,162,3)">Confirmalo aquí</a>
    </div>
  `
}

module.exports = templateResetPassword;