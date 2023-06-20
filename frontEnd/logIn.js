async function login(e){
    try{
        e.preventDefault()
        console.log('login button clicked')
        const userLoginData = {
            email : e.target.email.value,
            password : e.target.password.value
        }
        console.log(userLoginData)
    
        const res = await axios.post('http://localhost:3000/user/login',userLoginData)
        console.log(res,'response')
        // const parent = document.getElementById('success')
        if(res.status === 200){
            // const email = userLoginData.email
            // const id = res.data.data
            // console.log(email,'email')
            sessionStorage.clear()

            alert('login successfull')
            console.log(res.data.token)
            // // Assuming that the login was successful
            // const data = {email:email,id:id}
            // sessionStorage.setItem("data",JSON.stringify(data))
            sessionStorage.setItem('token',res.data.token)
            window.location = 'exp.html';
        }
    }
    catch(err){
        const parent = document.getElementById('success')
        console.log(err.response.status)
        if(err.response.status === 401){
            console.log('password mismatch')
            const para = document.createElement("p");
            const textNode = document.createTextNode("Wrong password");
            para.appendChild(textNode);
            parent.appendChild(para)

            await setTimeout(function() {
                document.getElementById('success').style.display = 'none';
                location.reload()
              }, 2000); // 5000 milliseconds = 5 seconds 
        }
        if(err.response.status === 404){
            console.log('password mismatch')
            const para = document.createElement("p");
            const textNode = document.createTextNode("You don't have account.Please create one");
            para.appendChild(textNode);
            parent.appendChild(para)

            await setTimeout(function() {
                document.getElementById('success').style.display = 'none';
                location.reload()
              }, 2000); // 5000 milliseconds = 5 seconds 
        }
    }
    
}