/* ==========================================
   1. GLOBAL ELEMENT SELECTION
   ========================================== */
let inputEl = document.querySelector("input");
let addBtn = document.querySelector(".add");
let clearBtn = document.querySelector(".clear");
let newItems = document.querySelector("ul");
// let itemEl = document.querySelector(".item");
// Note: itemEl is commented out because the initial HTML <li> was removed

/* ==========================================
   2. LOCAL STORAGE HELPERS
   ========================================== */
// Reads the saved tasks array from localStorage (or returns an empty array if none exist yet)
const getTasks = () => {
  const stored = localStorage.getItem("tasks");
  return stored ? JSON.parse(stored) : [];
};

// Scans all current <li> items on the page and saves them as an array to localStorage
const saveTasks = () => {
  const tasks = [];
  newItems.querySelectorAll("li").forEach((li) => {
    const textEl = li.querySelector(".item");
    tasks.push({
      text: textEl.innerText,
      completed: textEl.style.textDecoration === "line-through",
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

/* ==========================================
   3. MAIN APPLICATION FUNCTIONALITY
   ========================================== */
// Builds a single task <li> element (used both for new tasks and tasks loaded from storage)
const createTaskElement = (task) => {
  // Generate a brand new, empty <li> wrapper node
  let addItem = document.createElement("li");

  // Insert the inner layout template inside the new <li> element
  addItem.innerHTML = `
            <p class="item">${task.text}</p>
            <div class="items-btn">
              <button class="check">
                <i class="fa-solid fa-check fa-lg" style="color: green"></i>
              </button>
              <button class="edit"><i class="fa-solid fa-pen fa-lg" style="color: blue"></i></button>
              <button class="delete">
                <i class="fa-solid fa-trash fa-lg" style="color: red"></i>
              </button>
            </div>
          `;

  /* ==========================================
     4. SCOPED ITEM ACTION LISTENERS
     ========================================== */
  // Select the newly generated inner nodes for this specific row entry
  let checkTask = addItem.querySelector(".item");
  let checkBtn = addItem.querySelector(".check");
  let deleteBtn = addItem.querySelector(".delete");
  let editBtn = addItem.querySelector(".edit");

  // Apply completed styling if this task was already checked (relevant when loading from storage)
  if (task.completed) {
    checkTask.style.textDecoration = "line-through";
  }

  // Local Task Complete / Toggle Event Trigger(add or remove line-through)
  checkBtn.addEventListener("click", () => {
    if (checkTask.style.textDecoration === "line-through") {
      checkTask.style.textDecoration = "none";
    } else {
      checkTask.style.textDecoration = "line-through";
    }
    saveTasks();
  });

  // Edit Event listener/ edit and save changes

  editBtn.addEventListener("click", () => {
    // 1. Check if we are currently editing
    let isEditing = checkTask.contentEditable === "true";

    // 2. Toggle the editing state
    checkTask.contentEditable = !isEditing;

    if (!isEditing) {
      checkTask.focus();
      editBtn.innerHTML = `<i class="fa-solid fa-floppy-disk fa-lg" style="color: blue"></i>`;
    } else {
      editBtn.innerHTML = `<i class="fa-solid fa-pen fa-lg" style="color: blue"></i>`;
      saveTasks();
    }
  });
  // Local Task Row Delete Event Trigger
  deleteBtn.addEventListener("click", () => {
    addItem.remove();
    saveTasks();
  });

  return addItem;
};

const addTask = () => {
  // Check if the input is completely empty or just empty spaces
  if (inputEl.value.trim() === "") {
    alert("Please enter task!");
    return;
  }

  let task = { text: inputEl.value, completed: false };
  let addItem = createTaskElement(task);

  /* ==========================================
     5. DOM INJECTION & FIELD RESET
     ========================================== */
  // Safely attach the finished row directly to the main display container
  newItems.appendChild(addItem);

  // Clear layout field values back to standard placeholders
  inputEl.value = "";
  // Retains active typing cursor inside input box automatically
  inputEl.focus();

  // Persist the updated list to localStorage
  saveTasks();
};

/* ==========================================
   6. LOAD SAVED TASKS ON PAGE OPEN
   ========================================== */
const loadTasks = () => {
  const tasks = getTasks();
  tasks.forEach((task) => {
    let addItem = createTaskElement(task);
    newItems.appendChild(addItem);
  });
};

loadTasks();

/* ==========================================
   7. GLOBAL ACTION EVENT LISTENERS
   ========================================== */
// Listen for clicks to add single tasks

addBtn.addEventListener("click", addTask);

// Listen for clicks to clear all list content instantly
clearBtn.addEventListener("click", () => {
  newItems.innerHTML = "";
  saveTasks();
});
