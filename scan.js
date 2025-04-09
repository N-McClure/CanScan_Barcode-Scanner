// Global variables
let scannerActive = false;
let currentBarcode = "";

// Initialize scanner when the user clicks the "Start Scanning" button
document.getElementById('startCameraButton').addEventListener('click', function() {
    if (scannerActive) return;
    startScanner();
});

// Function to initialize and start the barcode scanner
function startScanner() {
    // Access the user's camera
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#reader'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["ean_reader", "ean_13_reader", "upc_reader", "upc_e_reader"]
        }
    }, function(err) {
        if (err) {
            console.error("Error initializing scanner:", err);
            return;
        }

        Quagga.start();
        scannerActive = true;
        document.getElementById('startCameraButton').style.display = "none"; // Hide the button
    });

    // Listen for a successful barcode scan
    Quagga.onDetected(handleBarcodeScan);
}

// Function to handle the barcode detection
function handleBarcodeScan(result) {
    currentBarcode = result.codeResult.code;
    console.log("Scanned Barcode:", currentBarcode);

    // Stop the scanner after detecting the barcode
    Quagga.stop();

    // Fetch product data using the barcode (assuming openfoodfacts API or similar)
    fetchProductData(currentBarcode);
}

// Function to fetch product data
function fetchProductData(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`; // Example API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                displayProductInfo(data.product);
                checkIfCanadian(data.product);
            } else {
                alert("Product not found or could not be retrieved.");
            }
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
            alert("Failed to fetch product information.");
        });
}

// Function to display product information
function displayProductInfo(product) {
    document.getElementById("productName").textContent = product.product_name || "-";
    document.getElementById("productBrand").textContent = product.brands || "-";
    document.getElementById("productCategory").textContent = product.categories || "-";
    document.getElementById("productDescription").textContent = product.description || "-";
    document.getElementById("productCountry").textContent = product.countries || "-";
    document.getElementById("productImage").src = product.image_url || "";

    document.getElementById("productInfo").style.display = "block"; // Show product info
    document.getElementById("rescanButton").style.display = "inline-block"; // Show rescan button
}

// Function to check if the product is Canadian
function checkIfCanadian(product) {
    const country = product.countries || "";
    if (country.toLowerCase().includes("canada")) {
        alert("This product is Canadian!");
    } else {
        alert("This product is not Canadian.");
    }
}

// Rescan functionality
document.getElementById('rescanButton').addEventListener('click', function() {
    // Reset and restart scanning
    Quagga.stop();
    document.getElementById('productInfo').style.display = "none";
    startScanner();
});
