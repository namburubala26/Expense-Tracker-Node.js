const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")

const User = require("../models/userSignup");
const resetPassword = require("../models/resetPassword");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } })
    const userName = user.name
    if (user) {
      const id = uuid.v4();
      const resetData = await resetPassword.create({
        id: id,
        active: true,
        userId: user.id,
      });
      let testAccount = await nodemailer.createTestAccount()
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jarvis1@ethereal.email',
            pass: 'EXUAYCZn7x83nnVdrY'
        } 
    })
      let info = await transporter.sendMail({
        from:'harshcode16@gmail.com', // sender address
        to:email, // list of receivers
        subject: "Reset password request", // Subject line
        text: "click on the reset password link", // plain text body
        html: `<p>Hey ${userName}, Click on the below link to rest your password</p><a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`, // html body
      })
      if(info){
        return res.status(202).json({
                  message: "Link to reset password sent to your mail ",
                  sucess: true,
                });
      }else{
        console.log('failed at node mailer',err)
      }
    
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // const msg = {
      //   to: email, // Change to your recipient
      //   from: "harshcode16@gmail.com", // Change to your verified sender
      //   subject: "Sending with SendGrid is Fun",
      //   text: "and easy to do anywhere, even with Node.js",
      //   html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      // };

    //   sgMail
    //     .send(msg)
    //     .then((response) => {
    //       // console.log(response[0].statusCode);
    //       // console.log(response[0].headers);
    //       return res.status(response[0].statusCode).json({
    //         message: "Link to reset password sent to your mail ",
    //         sucess: true,
    //       });
    //     })
    //     .catch((error) => {
    //       throw new Error(error);
    //     });
    // } else {
    //   throw new Error("User doesnt exist");
    }
  }
   catch (err) {
    console.log(err);
  }
};

const passwordReset = (req, res) => {
  const id = req.params.id;
  console.log(id, "id");
  resetPassword.findOne({ where: { id: id } }).then((resetId) => {
    if (resetId) {
      resetId.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    resetPassword
      .findOne({ where: { id: resetpasswordid } })
      .then((resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            // console.log('userDetails', user)
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" })
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      });
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};