const socket = io({ autoConnect: false });

let sendToTheRoom = document.querySelector(".sendToTheRoom");
let theList = document.querySelector(".theList");
let theListRoom = document.querySelector(".theListRoom");

let clickRoom;

let currentRoom = "";

const ulElement = document.querySelector(".theListRoom");
const config = { attributes: true, childList: true, subtree: true };

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      renderList();
    } else if (mutation.type === "attributes") {
      renderList();
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(ulElement, config);
/* observer.disconnect(); */

socket.connect();

socket.on("rooms_avaible", (rooms) => {
  // console.log(rooms);

  console.log(room);
  document.querySelector(".theListRoom").innerHTML = "";
  rooms.forEach((room) => {
    let theLi = document.createElement("li");

    theLi.innerText = room;

    theLi.classList.add("theroom");

    theListRoom.appendChild(theLi);
  });

  // for (let room in rooms) {
  //   console.log(room);

  //   document.querySelector(".theListRoom").innerHTML = "";

  //   let theLi = document.createElement("li");

  //   theLi.innerText = room;

  //   theLi.classList.add("theroom");

  //   theListRoom.appendChild(theLi);
  // }
});

let name;
let room;

const messages = [];

const renderMessages = () => {
  let outputMessage = document.querySelector(".output-message");
};

const renderList = () => {
  const ulElement = document.querySelector(".theListRoom");

  if (ulElement) {
    const liItems = ulElement.querySelectorAll("li");
    liItems.forEach((li) => {
      li.addEventListener("click", function () {
        console.log(`You are now in the room: ${li.textContent}`);
        clickRoom = li.textContent;

        socket.emit("join_room", clickRoom);
        room = clickRoom;

        // if (currentRoom) {
        if (currentRoom !== "") {
          socket.emit("leave", currentRoom);
          // currentRoom = clickRoom;
        }
        currentRoom = clickRoom;
      });
    });
  }

  // När jag lämmnar rummet så tas texten också bort från den som är kvar i rummet
  //
  // document.querySelector(".output-message").innerHTML = "";

  // När jag joinar först ett rum sedna lämnar och joinar ett nytt då får jag undefined och inga meddelande syns.
};

let sendInTheRoom = () => {
  // socket.connect();
  name = document.querySelector(".writeName").value;
  room = document.querySelector(".writeRoom").value;

  // console.log(writeName);
  // console.log(room);

  socket.emit("user_connect", name);

  if (room !== "") {
    socket.emit("join_room", `${room}`);

    // if (currentRoom) {
    // if (currentRoom !== "") {
    //   socket.emit("leave", currentRoom);
    //   currentRoom = clickRoom;
    // }
  }

  // socket.on("room_created", (room) => {
  //   let theLi = document.createElement("li");
  //   theLi.innerText = room;
  //   theLi.classList.add("theroom");
  //   theListRoom.appendChild(theLi);
  // });

  socket.on("a_user_has_connect", (username) => {
    //  Detta syns för alla oavsett vilket rum jag joinar
    //
    // let li = document.createElement("li");
    // li.innerText = username + " join the chat!";
    // theList.appendChild(li);
  });

  socket.on("message", (message) => {
    let theLi = document.createElement("li");
    theLi.innerText = message;
    theLi.classList.add("theroom");
    theListRoom.appendChild(theLi);
  });

  document.querySelector(".writeName").value = "";
  document.querySelector(".writeRoom").value = "";
};

sendToTheRoom.addEventListener("click", sendInTheRoom);

socket.on("room_created", (room) => {
  let theLi = document.createElement("li");

  // theLi.setAttribute("id", `theroom${i}`);

  theLi.innerText = room;
  theLi.classList.add("theroom");
  theListRoom.appendChild(theLi);
});

let sendMessage = document.querySelector(".sendMessage");
let outputMessage = document.querySelector(".output-message");
let inputChat = document.querySelector(".inputChat");

socket.on("output-message", (message) => {
  console.log(message);
  messages.push(message);

  // for (const message of messages) {
  // if (message.room === room) {
  let li = document.createElement("li");
  li.innerText = `${message.username} skrev: ${message.message}`;
  outputMessage.appendChild(li);
  // }
  // }

  // let writeName = document.querySelector(".writeName").value;

  // document.querySelector(".writeName").value = "";
  // document.querySelector(".writeRoom").value = "";
});

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// username = urlParams.get("username");
// room = urlParams.get("room");
// socket.emit("join_room", `${room}`);

// När man skriver i input för chatten ska det stå för alla skriver
//

let theText;
name = document.querySelector(".writeName").value;
let writer = document.getElementById("writer");

writer.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }

  socket.emit("writer", { name: name, room: room });
  if (writer.onkeydown) {
    theText = `${name}: skriver!`;
  } else if ((writer = "")) {
    theText = "";
  }
  document.querySelector(".output-writer").innerHTML = theText;
});

socket.on("writing", (username) => {
  console.log(username);

  document.querySelector(".output-writer").innerHTML = `${username}: skriver!`;
  setTimeout(() => {
    document.querySelector(".output-writer").innerHTML = "";
  }, 1000);
});

let send = () => {
  let inputChat = document.querySelector(".inputChat").value;
  // let writeName = document.querySelector(".writeName").value;

  socket.emit("output-message", {
    username: name,
    message: inputChat,
    room: room,
  });

  document.querySelector(".inputChat").value = "";
};

sendMessage.addEventListener("click", send);

let leave = document.querySelector(".leave");

leave.addEventListener("click", () => {
  socket.emit("leave", clickRoom);

  //
  // let removeOne;
  // removeOne = theListRoom.querySelector(".theroom");
  // theListRoom.innerHTML = "";
  //

  console.log("Du lämmnade rum:", `${room}`);

  outputMessage.innerHTML = "";

  let theName = document.querySelector(".showleave");
  theName.innerHTML = `Du lämmnade rummet!`;

  setTimeout(() => {
    if (theName) {
      theName.innerHTML = "";
    }
  }, 1000);
});

// var currentdate = new Date();
// currentdate =
//   "Last Sync: " +
//   currentdate.getDate() +
//   "/" +
//   (currentdate.getMonth() + 1) +
//   "/" +
//   currentdate.getFullYear() +
//   " @ " +
//   currentdate.getHours() +
//   ":" +
//   currentdate.getMinutes() +
//   ":" +
//   currentdate.getSeconds();

// console.log(currentdate);
