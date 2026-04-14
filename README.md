# 🔒 LockBox: Encrypt and Hash Your Texts

<p align="center">
    <a href="[YOUR_VERCEL_URL_HERE]" target="_blank">
        <img src="https://raw.githubusercontent.com/harshezz/LockBox/main/.github/logo-dark.svg" alt="LockBox Logo" width="200">
    </a>
</p>

<p align="center">
  A straightforward platform built with Next.js to help you easily encrypt and hash text using popular algorithms like AES, RSA, and SHA. <br>
  This project includes both a web interface and a simple REST API.
</p>

---

## 🚀 Getting Started

This guide will get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need Node.js installed to run this project.

- **Node.js:** Version 14.6.0 or newer (download from nodejs.org)

### Installation

1.  **Clone the Repository:**
    Open your terminal (like PowerShell or Git Bash) and run:

    ```bash
    git clone [https://github.com/harshezz/LockBox.git](https://github.com/harshezz/LockBox.git)
    ```

2.  **Navigate to the Project Folder:**

    ```bash
    cd LockBox
    ```

3.  **Install Dependencies:**
    This downloads all the necessary libraries (like React, Next.js, and Tailwind CSS).
    ```bash
    npm install
    ```

### Run the Development Server

Start the application on your computer:

```bash
npm run dev
```

## ✨ Recent Optimization & UI Improvements

- Unified app metadata handling using the App Router metadata API.
- Consolidated global styling into a single source (`/styles/globals.css`) with reusable design tokens.
- Standardized cards, form controls, and button styles across all algorithm pages.
- Improved accessibility with stronger contrast, focus states, labels, and disabled/loading states.
- Hardened API route query parsing for safer request handling and stricter TypeScript compatibility.
- Fixed multiple build blockers and updated project config to be compatible with the current Next.js setup.
