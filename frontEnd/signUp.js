async function signup(e){
    try{
        e.preventDefault()
    console.log(' signup button clicked')
    const userSignupData = {
        name : e.target.name.value,
        email : e.target.email.value,
        password : e.target.password.value
    }
    console.log(userSignupData)
    const res = await axios.post('http://localhost:3000/user/signup',userSignupData)
        const parentElement = document.getElementById('success')
        console.log(res)
        if(res.status===201){
            const para = document.createElement("p");
            const textNode = document.createTextNode("Account successfully created!!!");
            para.appendChild(textNode);
            parentElement.appendChild(para)

            setTimeout(function() {
                document.getElementById('success').style.display = 'none';
                location.reload()
              }, 2000); // 5000 milliseconds = 5 seconds
            
        }
    }
    catch(err){
        console.log(err.response.data.message,'this is error')
        const parentNode = document.getElementById('error1')
        // const parentContainer = document.getElementById('error2')
        if(err.response.data.message.name === 'SequelizeUniqueConstraintError'){
            const para = document.createElement("p");
            const textNode = document.createTextNode("Email already taken!! Please login with your email");
            para.appendChild(textNode);
            parentNode.appendChild(para)

            await setTimeout(function() {
                document.getElementById('error1').style.display = 'none';
                location.reload() 
              }, 2000); // 5000 milliseconds = 5 seconds
            
        }
        if(err.response.data.message === 'empty fields'){
            const para = document.createElement("p");
            const textNode = document.createTextNode("Please enter data in all fields");
            para.appendChild(textNode);
            parentNode.appendChild(para)

            await setTimeout(function() {
                document.getElementById('error1').style.display = 'none';
                location.reload() 
              }, 2000); // 5000 milliseconds = 5 seconds 
              
        }
    }
    
}