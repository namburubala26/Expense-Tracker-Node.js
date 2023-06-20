async function expense(e) {
    e.preventDefault();
    try {
      const expenseData = {
        price: e.target.price.value,
        desc: e.target.desc.value,
        categ: e.target.categ.value,
      };
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/expense/add",
        expenseData,
        { headers: { Authorization: token } }
      );
      console.log(res.data.allExpense);
      showUserExpense(res);
    } catch (err) {
      console.log(err);
    }
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      // const rowValue = await rowChange()
      // console.log(rowValue)
      const rowValue = localStorage.getItem('expPerPage')
      console.log(rowValue)
      const token = sessionStorage.getItem("token");
      let page = 1
      let expPerPage = rowValue
      const expenseData = await axios.get(
        `http://localhost:3000/expense/get/expensePerPage?page=${page}&expPerPage=${expPerPage}`,
        { headers: { Authorization: token } }
      );
      if (expenseData.status === 200) {
        premium(expenseData);
        const parentFile = document.getElementById("files");
        const fileUser = expenseData.data.hasFiles;
        parentFile.innerHTML = "";
        for (let i = 0; i < fileUser.length; i++) {
          const link = document.createElement("a");
          link.href = fileUser[i].URL;
          link.download = "file-" + (i + 1) + ".csv";
          link.innerHTML = "Downloaded file-" + (i + 1);
          link.classList.add("download-link");
          parentFile.appendChild(link);
        }
      }
      showUserExpense(expenseData)
      showPagination(expenseData.data)
  
    } catch (err) {
      console.log(err);
    }
  });
  
  async function showUserExpense(expenseData) {
    const parentElement = document.getElementById("list");
    try {
      let data = expenseData.data.allExpense;
      // parentElement.innerHTML = "";
      data.forEach((info) => {
        const li = document.createElement("li");
        li.id = `${info.id}`;
        li.className = "litext";
        li.appendChild(
          document.createTextNode(`${info.price}- ${info.desc}-${info.categ}`)
        );
        parentElement.appendChild(li);
  
        let delBtn = document.createElement("button");
        delBtn.id = "delete";
        delBtn.className = "libtn";
        delBtn.appendChild(document.createTextNode("delete"));
        delBtn.onclick = function () {
          delData(info.id);
        };
        li.appendChild(delBtn);
        parentElement.appendChild(li);
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage}){
    console.log(currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage,firstPage)
    const grandParent = document.getElementById('data')
    const midParent = document.getElementById('list')
    const ParentElement = document.getElementById('pagination')
    currentPage = Number(currentPage)
    if(hasPreviousPage){
      const btn1 = document.createElement('button')
      btn1.className = 'pageButton'
      btn1.innerHTML = '<<'
      btn1.addEventListener('click',()=>getItems(previousPage))
      ParentElement.appendChild(btn1)
      midParent.appendChild(btn1)
    }
  
    if(hasNextPage){
      const btn2 = document.createElement('button')
      btn2.className = 'pageButton'
      btn2.innerHTML = '>>'
      btn2.addEventListener('click',()=>getItems(nextPage))
      ParentElement.appendChild(btn2)
      midParent.appendChild(btn2)
    }
    grandParent.appendChild(midParent)
  }
  
  async function getItems(page){
    console.log('entered in get items')
    
    // console.log(expPerPage)
    try{
      const expPerPage = localStorage.getItem('expPerPage')
      const token = sessionStorage.getItem("token");
      console.log(token,expPerPage)
      const parentSection = document.getElementById('list')
      const ParentElement = document.getElementById('pagination')
      const expenseData = await axios.get(
        `http://localhost:3000/expense/get/expensePerPage?page=${page}&expPerPage=${expPerPage}`,
        { headers: { Authorization: token } }
      );
        console.log('after expense data')
      parentSection.innerHTML=''
      ParentElement.innerHTML=''
      console.log(expenseData.data)
      showUserExpense(expenseData)
      showPagination(expenseData.data)
    
    }
    catch(err){
      console.log(err)
    }
    
  }
  
  async function delData(infoId) {
    console.log(infoId, "delete ID");
    try {
      const token = sessionStorage.getItem("token");
      const delres = await axios.delete(
        `http://localhost:3000/expense/delData/${infoId}`,
        { headers: { Authorization: token } }
      );
      if (delres.status === 200) {
        let ul = document.getElementById("list");
        let li = document.getElementById(infoId);
        ul.removeChild(li);
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  document.getElementById("rzp-button1").onclick = async function (e) {
    const token = sessionStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/purchase/premium", {
      headers: { Authorization: token },
    });
    console.log(response, "razorpay resoponse");
    var options = {
      key: response.data.key_id, // Enter the Key ID generated from the Dashboard
      name: "Test Company",
      order_id: response.data.order.id, // For one time payment
      prefill: {
        name: "Test User",
        email: "test.user@example.com",
        contact: "7003442036",
      },
      theme: {
        color: "#3399cc",
      },
      // This handler function will handle the success payment
      handler: function (response) {
        //  console.log(response);
        axios
          .post(
            "http://localhost:3000/purchase/update",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          )
          .then(() => {
            alert("You are a Premium User Now");
            showUserExpense();
          })
          .catch(() => {
            alert("Something went wrong. Try Again!!!");
          });
      },
    };
  
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
    });
  };
  
  async function leaderBoard(e) {
    e.preventDefault();
    console.log("clicked on leaderBoard button");
    const token = sessionStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/purchase/showleaderboard",
      { headers: { Authorization: token } }
    );
    // console.log(response.data.data);
    let userPrices = response.data.data;
    userPrices.forEach((userPrice) => {
      const name = userPrice.user.name;
      const totalPrice = userPrice.totalPrice;
  
      const leaderli = document.createElement("li");
      leaderli.className = "litext";
      leaderli.appendChild(document.createTextNode(`${name}- ${totalPrice}`));
      document.getElementById("leaderList").appendChild(leaderli);
    });
  }
  
  function download() {
    const token = sessionStorage.getItem("token");
    axios
      .get("http://localhost:3000/user/download", {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = "myexpense.csv";
          a.click();
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function premium(expense) {
    console.log("enterd here");
    const parentPremium = document.getElementById("razor-button");
    const childPremium = document.getElementById("rzp-button1");
    const parentLeaderBoard = document.getElementById("leaderBoardConitaner");
    const parentDownload = document.getElementById("download");
    const files = expense.data.hasFiles;
    console.log(files.length);
    if (expense.data.ispremium === 1) {
      if (!childPremium) {
        return;
      }
      parentPremium.removeChild(childPremium);
      let textNode = document.createTextNode("Premium User");
      parentPremium.appendChild(textNode);
      let leaderButton = document.createElement("button");
      leaderButton.id = "leaderBoard";
      leaderButton.textContent = "Leader Board";
      parentLeaderBoard.appendChild(leaderButton);
      leaderButton.onclick = leaderBoard;
  
      let downloadButton = document.createElement("button");
      downloadButton.id = "downloadexpense";
      downloadButton.textContent = "Download File";
      downloadButton.onclick = download;
      parentDownload.appendChild(downloadButton);
  
      if (files.length > 0) {
        let textNode = document.createElement("p");
        textNode.id = "filetext";
        textNode.textContent = "Previous records";
        parentDownload.appendChild(textNode);
      } else {
        let textNode = document.createElement("p");
        textNode.id = "filetext";
        textNode.textContent = "No Previous records";
        parentDownload.appendChild(textNode);
      }
    }
  }
  
  function rowChange(e){
    // e.preventDefault()
    console.log(e.target.value,'value')
    console.log(typeof(e.target.value))
    const rowValue = Number(e.target.value)
    console.log(typeof(rowValue))
    localStorage.setItem("expPerPage", rowValue)
    location.reload()
  }