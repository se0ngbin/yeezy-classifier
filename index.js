function onFileSelected(event) {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    const imgtag = document.getElementById("myImage");
    imgtag.title = selectedFile.name;

    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);

    const predictionEl = document.getElementById('prediction')
    const confidencesEl = document.getElementById('confidences')
    const errorEl = document.getElementById('error')

    reader.addEventListener("loadend", function () {
        // Make a API call by passing our image
        fetch('https://hf.space/embed/se0ngbin/yeezy-classifier/+/api/predict', {
            method: "POST",
            body: JSON.stringify({ "data": [reader.result] }),
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            if (response.status != 200) {
                errorEl.innerHTML = '<u>Sorry the API is not working currently. Please try again later</u>'
                predictionEl.innerHTML = '';
                confidencesEl.innerHTML = '';
                return;
            }
            return response.json();
        }).then(function (json_response) {
            const label = json_response?.data[0]?.label;
            const confidence = json_response?.data[0]?.confidences[0]?.confidence

            // show the prediction
            predictionEl.innerHTML = `Prediction: Yeezy ${label}`
            confidencesEl.innerHTML = `Confidence: ${confidence}`
            errorEl.innerHTML = '';
            return;
        })
    });
}