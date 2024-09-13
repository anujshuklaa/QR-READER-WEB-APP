function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {
    let zoomLevel = 1;
    const zoomIncrement = 0.1;
    const maxZoomLevel = 4;

    function setCameraZoom(zoom) {
        const videoElement = document.querySelector('#my-qr-reader video');
        if (videoElement) {
            videoElement.style.transform = `scale(${zoom})`;
            videoElement.style.transformOrigin = 'center center';
        }
    }

    function showLoading() {
        document.getElementById('loading-indicator').classList.remove('loading-hidden');
        document.getElementById('loading-indicator').classList.add('loading-visible');
    }

    function hideLoading() {
        document.getElementById('loading-indicator').classList.remove('loading-visible');
        document.getElementById('loading-indicator').classList.add('loading-hidden');
    }

    function onScanSuccess(decodeText, decodeResult) {
        setTimeout(function () {
            window.location.href = decodeText;
            showLoading();
        }, 500); // Adjust delay as needed
    }

    function adjustZoom(decodeResult) {
        zoomLevel = Math.min(maxZoomLevel, zoomLevel + zoomIncrement);
        setCameraZoom(zoomLevel);
    }

    try {
        let htmlscanner = new Html5QrcodeScanner(
            "my-qr-reader",
            {
                fps: 25,
                qrbox: 300,
                aspectRatio: 1,
            }
        );
        htmlscanner.render(function (decodeText, decodeResult) {
            onScanSuccess(decodeText, decodeResult);
            adjustZoom(decodeResult);
        });
    } catch (error) {
        console.error("Failed to initialize Html5QrcodeScanner:", error);
    }
});
