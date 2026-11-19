// ======================================
// PHONE MASTER LOGIN SYSTEM
// ======================================
 
const adminUsername = "jron";
const adminPassword = "Gabby27";
 
const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const appContainer = document.querySelector(".app-container");
 
// LOGIN
loginForm.addEventListener("submit", function(event) {
 
    event.preventDefault();
 
    const username =
        document.getElementById("loginUsername").value.trim();
 
    const password =
        document.getElementById("loginPassword").value;
 
    if (
        username === adminUsername &&
        password === adminPassword
    ) {
 
        sessionStorage.setItem("phoneMasterLogin", "true");
 
        loginPage.style.display = "none";
        appContainer.style.display = "block";
 
        document.getElementById("loginError").textContent = "";
 
        displayRecords();
 
    } else {
 
        document.getElementById("loginError").textContent =
            "Invalid username or password!";
 
    }
 
});
 
// LOGOUT
function logout() {
 
    if (confirm("Are you sure you want to logout?")) {
 
        sessionStorage.removeItem("phoneMasterLogin");
 
        appContainer.style.display = "none";
        loginPage.style.display = "flex";
 
        loginForm.reset();
 
        document.getElementById("loginError").textContent = "";
 
    }
 
}
 
// CHECK LOGIN BEFORE SHOWING HOME
window.addEventListener("DOMContentLoaded", function() {
 
    if (sessionStorage.getItem("phoneMasterLogin") === "true") {
 
        loginPage.style.display = "none";
        appContainer.style.display = "block";
 
    } else {
 
        loginPage.style.display = "flex";
        appContainer.style.display = "none";
 
    }
 
});
 
 
// ======================================
// PHONE MASTER SYSTEM - SCRIPT.JS
// ======================================
 
// Load saved records
let records = [];
 
try {
    records = JSON.parse(localStorage.getItem("masterList")) || [];
} catch (error) {
    console.error("Unable to load records:", error);
    records = [];
}
 
// Save records
function saveData() {
    try {
        localStorage.setItem("masterList", JSON.stringify(records));
        return true;
    } catch (error) {
        alert("Unable to save records. Check your browser storage.");
        console.error(error);
        return false;
    }
}
 
// Get HTML elements
const recordForm = document.getElementById("recordForm");
const recordTable = document.getElementById("recordTable");
const searchInput = document.getElementById("search");
 
// Website dashboard IDs
const websites = [
    "MPOSPORT",
    "QQDEWA",
    "QQSLOT",
    "MPO222",
    "BRANI",
    "MPO777",
    "BRANI777",
    "MPOFUN",
    "INDOSLOT",
    "QQ998",
    "MPO888",
    "88PULSA",
    "NEKATWIN",
    "MACANTOGEL",
    "SEPUHPLAY",
    "PERKISWIN",
    "MPOFAFA",
    "MASTERPOKER",
    "99DEWA"
];
 
// ======================================
// DISPLAY RECORDS
// ======================================
 
function displayRecords() {
 
    recordTable.innerHTML = "";
 
    const searchValue = searchInput.value.toLowerCase().trim();
 
    const filteredRecords = records.filter(record => {
 
        return (
            (record.name || "").toLowerCase().includes(searchValue) ||
            (record.AccountNumber || "").toLowerCase().includes(searchValue) ||
            (record.Website || "").toLowerCase().includes(searchValue) ||
            (record.Reason || "").toLowerCase().includes(searchValue) ||
            (record.Banksite || "").toLowerCase().includes(searchValue) ||
            (record.date || "").toLowerCase().includes(searchValue)
        );
    });
 
    filteredRecords.forEach((record, index) => {
 
        const row = recordTable.insertRow();
 
        const values = [
            index + 1,
            record.date || "",
            record.AccountNumber || "",
            record.name || "",
            record.Website || "",
            record.Reason || "",
            record.Banksite || ""
            
        ];
 
        values.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
 
        // Action buttons
        const actionCell = row.insertCell();
 
        const editButton = document.createElement("button");
        editButton.innerHTML = "✏️ Edit";
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => {
            editRecord(record.id);
        });
 
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "🗑 Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteRecord(record.id);
        });
 
        actionCell.append(editButton, deleteButton);
    });
 
    updateDashboard();
}
 
// ======================================
// UPDATE DASHBOARD
// ======================================
 
function updateDashboard() {
 
    const totalElement = document.getElementById("total");
 
    if (totalElement) {
        totalElement.textContent = records.length;
    }
 
    websites.forEach(website => {
 
        const element = document.getElementById(website);
 
        if (element) {
            const count = records.filter(record =>
                record.Website === website
            ).length;
 
            element.textContent = count;
        }
    });
}
 
// ======================================
// ADD AND UPDATE RECORD
// ======================================
 
recordForm.addEventListener("submit", function(event) {
 
    event.preventDefault();
 
    const editId = document.getElementById("editId").value;
 
    const record = {
        id: editId || (
            window.crypto && window.crypto.randomUUID
                ? window.crypto.randomUUID()
                : Date.now().toString()
        ),
 
        name: document.getElementById("name").value.trim(),

        Banksite: document.getElementById("Banksite").value.trim(),
 
        date: document.getElementById("recordDate").value,
 
        AccountNumber: document.getElementById("Account Number").value.trim(),
 
        Website: document.getElementById("Website").value,
 
        Reason: document.getElementById("Reason / Remarks").value.trim()
    };
 
    if (
        !record.name ||
        !record.Banksite ||
        !record.date ||
        !record.AccountNumber ||
        !record.Website
    ) {
        alert("Please complete all required fields.");
        return;
    }
 
    if (editId) {
 
        const index = records.findIndex(item => item.id === editId);
 
        if (index !== -1) {
            records[index] = record;
        }
 
    } else {
 
        records.push(record);
 
    }
 
    if (!saveData()) {
        return;
    }
 
    recordForm.reset();
 
    document.getElementById("editId").value = "";
 
    document.getElementById("saveButton").textContent = "+ Add Record";
 
    displayRecords();
 
    alert(editId ? "Record updated successfully!" : "Record added successfully!");
});
 
// ======================================
// EDIT RECORD
// ======================================
 
function editRecord(id) {
 
    const record = records.find(item => item.id === id);
 
    if (!record) return;
 
    document.getElementById("editId").value = record.id;
 
    document.getElementById("name").value = record.name || "";

    document.getElementById("Banksite").value = 
        record.Banksite || "";
    
    document.getElementById("recordDate").value = record.date || "";
 
    document.getElementById("Account Number").value =
        record.AccountNumber || "";
 
    document.getElementById("Website").value = record.Website || "";
 
    document.getElementById("Reason / Remarks").value =
        record.Reason || "";
 
    document.getElementById("saveButton").textContent = "Update Record";
 
    // Open Website List page
    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
    });
 
    document.getElementById("websiteList").classList.add("active");
 
    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === "websiteList"
        );
    });
 
    window.scrollTo({ top: 0, behavior: "smooth" });
}
 
// ======================================
// DELETE RECORD
// ======================================
 
function deleteRecord(id) {
 
    const confirmDelete = confirm(
        "Are you sure you want to delete this record?"
    );
 
    if (!confirmDelete) return;
 
    records = records.filter(record => record.id !== id);
 
    if (saveData()) {
        displayRecords();
        alert("Record deleted successfully!");
    }
}
 
// ======================================
// SEARCH RECORDS
// ======================================
 
searchInput.addEventListener("input", displayRecords);
 
// ======================================
// INITIAL DISPLAY
// ======================================
 
displayRecords();