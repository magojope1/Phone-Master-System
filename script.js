
// ======================================
// PHONE MASTER SYSTEM - COMPLETE SCRIPT
// ======================================

// ======================================
// ADMIN USERS / LOGIN SYSTEM
// ======================================

const adminUsers = [
    { username: "jron", password: "789789" },
    { username: "jl", password: "789789" },
    { username: "russ", password: "789789" }
];

const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const appContainer = document.querySelector(".app-container");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;

        const validUser = adminUsers.find(user =>
            user.username === username &&
            user.password === password
        );

        if (validUser) {
            sessionStorage.setItem("phoneMasterLogin", "true");

            if (loginPage) loginPage.style.display = "none";
            if (appContainer) appContainer.style.display = "block";

            document.getElementById("loginError").textContent = "";

            displayRecords();
        } else {
            document.getElementById("loginError").textContent =
                "Invalid username or password!";
        }
    });
}

// LOGOUT
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem("phoneMasterLogin");

        if (appContainer) appContainer.style.display = "none";
        if (loginPage) loginPage.style.display = "flex";

        if (loginForm) loginForm.reset();

        const error = document.getElementById("loginError");
        if (error) error.textContent = "";
    }
}

// CHECK LOGIN
window.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("phoneMasterLogin") === "true") {
        if (loginPage) loginPage.style.display = "none";
        if (appContainer) appContainer.style.display = "block";
    } else {
        if (loginPage) loginPage.style.display = "flex";
        if (appContainer) appContainer.style.display = "none";
    }
});


// ======================================
// LOAD AND SAVE RECORDS
// ======================================

let records = [];

try {
    records = JSON.parse(localStorage.getItem("masterList")) || [];
} catch (error) {
    console.error("Unable to load records:", error);
    records = [];
}

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


// ======================================
// HTML ELEMENTS
// ======================================

const recordForm = document.getElementById("recordForm");
const recordTable = document.getElementById("recordTable");
const searchInput = document.getElementById("search");

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
// DISPLAY MAIN RECORDS
// ======================================

function displayRecords() {
    if (!recordTable || !searchInput) return;

    recordTable.innerHTML = "";

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredRecords = records.filter(record => {
        return (
            (record.name || "").toLowerCase().includes(searchValue) ||
            (record.AccountNumber || "").toLowerCase().includes(searchValue) ||
            (record.Website || "").toLowerCase().includes(searchValue) ||
            (record.Reason || "").toLowerCase().includes(searchValue) ||
            (record.date || "").toLowerCase().includes(searchValue) ||
            (record.Banksite || "").toLowerCase().includes(searchValue)
        );
    });

    if (filteredRecords.length === 0) {
        recordTable.innerHTML = `
            <tr>
                <td colspan="8">No records found.</td>
            </tr>
        `;
    }

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

        const actionCell = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "✏️ Edit";
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editRecord(record.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑 Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteRecord(record.id));

        actionCell.append(editButton, deleteButton);
    });

    updateDashboard();
}


// ======================================
// UPDATE DASHBOARD COUNTS
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
// ADD / UPDATE RECORD
// ======================================

if (recordForm) {
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
            date: document.getElementById("recordDate").value,
            AccountNumber: document.getElementById("Account Number").value.trim(),
            Website: document.getElementById("Website").value,
            Reason: document.getElementById("Reason / Remarks").value.trim(),
            Banksite: document.getElementById("Banksite").value.trim()
        };

        if (
            !record.name ||
            !record.date ||
            !record.AccountNumber ||
            !record.Website ||
            !record.Banksite
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

        if (!saveData()) return;

        recordForm.reset();

        document.getElementById("editId").value = "";

        document.getElementById("saveButton").textContent = "+ Add Record";

        displayRecords();
        displayWebsiteRecords();

        alert(editId ? "Record updated successfully!" : "Record added successfully!");
    });
}


// ======================================
// EDIT RECORD
// ======================================

function editRecord(id) {
    const record = records.find(item => item.id === id);

    if (!record) return;

    document.getElementById("editId").value = record.id;
    document.getElementById("name").value = record.name || "";
    document.getElementById("recordDate").value = record.date || "";
    document.getElementById("Account Number").value = record.AccountNumber || "";
    document.getElementById("Website").value = record.Website || "";
    document.getElementById("Reason / Remarks").value = record.Reason || "";
    document.getElementById("Banksite").value = record.Banksite || "";

    document.getElementById("saveButton").textContent = "Update Record";

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
        displayWebsiteRecords();

        alert("Record deleted successfully!");
    }
}


// ======================================
// MAIN SEARCH
// ======================================

if (searchInput) {
    searchInput.addEventListener("input", displayRecords);
}


// ======================================
// WEBSITE DETAILS SYSTEM
// ======================================

let currentWebsite = "";

function openWebsite(website) {
    currentWebsite = website;

    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById("websiteDetails").classList.add("active");

    document.getElementById("selectedWebsite").textContent = website;
    document.getElementById("websiteTableTitle").textContent =
        website + " Records";

    document.getElementById("websiteSearch").value = "";

    displayWebsiteRecords();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// DISPLAY SELECTED WEBSITE RECORDS
function displayWebsiteRecords() {
    const table = document.getElementById("websiteRecordTable");
    const searchElement = document.getElementById("websiteSearch");
    const totalElement = document.getElementById("websiteTotal");

    if (!table || !searchElement) return;

    const websiteRecords = records.filter(record =>
        (record.Website || "").toUpperCase() === currentWebsite.toUpperCase()
    );

    const search = searchElement.value.toLowerCase().trim();

    const filteredRecords = websiteRecords.filter(record => {
        return (
            (record.name || "").toLowerCase().includes(search) ||
            (record.AccountNumber || "").toLowerCase().includes(search) ||
            (record.Reason || "").toLowerCase().includes(search)
        );
    });

    if (totalElement) {
        totalElement.textContent = websiteRecords.length;
    }

    table.innerHTML = "";

    if (filteredRecords.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No records found for ${currentWebsite}.
                </td>
            </tr>
        `;
        return;
    }

    filteredRecords.forEach((record, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            record.date || "",
            record.AccountNumber || "",
            record.name || "",
            record.Reason || ""
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });
}


// WEBSITE SEARCH
const websiteSearch = document.getElementById("websiteSearch");

if (websiteSearch) {
    websiteSearch.addEventListener("input", displayWebsiteRecords);
}


// ======================================
// BACK TO DASHBOARD
// ======================================

function backToDashboard() {
    document.querySelectorAll(".page-view").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById("dashboard").classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(nav => {
        nav.classList.toggle(
            "active",
            nav.dataset.page === "dashboard"
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================
// INITIAL DISPLAY
// ======================================

displayRecords();
