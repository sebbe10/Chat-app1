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

socket.connect();

socket.on("rooms_avaible", (rooms) => {
  console.log(room);
  document.querySelector(".theListRoom").innerHTML = "";
  rooms.forEach((room) => {
    let theLi = document.createElement("li");

    theLi.innerText = room;

    theLi.classList.add("theroom");

    theListRoom.appendChild(theLi);
  });
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

        if (currentRoom !== "") {
          socket.emit("leave", currentRoom);

          messages = [];
        }
        currentRoom = clickRoom;
      });
    });
  }
};

let sendInTheRoom = () => {
  name = document.querySelector(".writeName").value;
  room = document.querySelector(".writeRoom").value;

  socket.emit("user_connect", name);

  if (room !== "") {
    socket.emit("join_room", `${room}`);
  }

  socket.on("a_user_has_connect", (username) => {});

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

  let li = document.createElement("li");
  li.innerText = `${message.username} skrev: ${message.message}`;
  outputMessage.appendChild(li);
});

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
