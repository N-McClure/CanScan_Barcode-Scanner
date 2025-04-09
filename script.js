console.log("Running and Connected...");

// Function to hide the Splash screen after 5 seconds:
function hideSplash() {
  document.getElementById("splash-screen").style.display = "none";
}
setTimeout(hideSplash, 2500);