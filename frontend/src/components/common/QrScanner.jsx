import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onResult, qrbox, fps }) => {
  const scannerRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-code-reader",
        {
          qrbox: qrbox || { width: 250, height: 250 },
          fps: fps || 10,
        },
        false // Verbose logging
      );

      scannerRef.current.render(onScanSuccess, onScanError);
    }

    function onScanSuccess(decodedText, decodedResult) {
      // Handle the scanned code here
      console.log(`Scan result: ${decodedText}`, decodedResult);
      onResult(decodedText, decodedResult);
      setErrorMessage(null); // Clear any previous error
    }

    function onScanError(error) {
      // console.warn(`QR Scan Error: ${error}`);
      setErrorMessage(`QR Scan Error: ${error}`);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5-qrcode scanner", error);
        });
        scannerRef.current = null; // Reset ref
      }
    };
  }, [onResult, qrbox, fps]);

  return (
    <div>
      <div id="qr-code-reader" style={{ width: '100%' }} />
      {errorMessage && <p className="text-red-500 text-sm mt-2">Error: {errorMessage}</p>}
    </div>
  );
};

export default QrScanner;
