document.getElementById("checkButton").addEventListener("click", () => {
    const barcode = document.getElementById("barcodeInput").value.trim();
    if (!barcode || !/^\d+$/.test(barcode)) {
        alert("Please enter a valid numeric barcode.");
        return;
    }

    checkIfCanadianByPrefix(barcode);
    fetchProductData(barcode);
});

function checkIfCanadianByPrefix(code) {
    const prefix = code.substring(0, 3);
    const canadianPrefixes = [
        "060", "061", "062", "063", "064", "065", "066", "067", "068", "069",
        "754", "755"
    ];

    if (canadianPrefixes.includes(prefix)) {
        alert(`✅ This barcode (${code}) appears to be Canadian (prefix: ${prefix}).`);
    } else {
        alert(`❌ This barcode (${code}) is not recognized as Canadian (prefix: ${prefix}).`);
    }
}

function fetchProductData(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === 1) {
                displayProductInfo(data.product);
            } else {
                alert("❌ Product not found in OpenFoodFacts.");
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("❌ Could not retrieve product information.");
        });
}

function displayProductInfo(product) {
    document.getElementById("productName").textContent = product.product_name || "-";
    document.getElementById("productBrand").textContent = product.brands || "-";
    document.getElementById("productCategory").textContent = product.categories || "-";
    document.getElementById("productDescription").textContent = product.generic_name || "-";
    document.getElementById("productCountry").textContent = product.countries || "-";
    document.getElementById("productImage").src = product.image_url || "";

    document.getElementById("productInfo").style.display = "block";
}
