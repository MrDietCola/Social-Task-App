require('dotenv').config();

async function getEmotion(text) {

    if (!process.env.EMOTION_API) {
        return processResults(false);
    }
    const url = 'https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.EMOTION_KEY,
            'X-RapidAPI-Host': 'twinword-emotion-analysis-v1.p.rapidapi.com'
        },
        body: new URLSearchParams({
            text: text
        })
    };

    try {
        const response = await fetch(url, options);
        const result = JSON.parse(await response.text());
        return processResults(result);
    } catch (error) {
        console.error(error);
        return processResults(false);
    }
}

function processResults(res) {
    console.log(res);
    if (!res) {
        return "Unavailable";
    }
    else if (res.emotions_detected.length > 0) {
        return res.emotions_detected.join(', ');
    }
    else {
        let hasEmotion = [];
        for (let key in res.emotion_scores) {
            if (res.emotion_scores[key] > 0) {
                hasEmotion.push(`${key}(${res.emotion_scores[key]})`);
            }
        }
        return hasEmotion.length > 0 ? 'Hints of ' + hasEmotion.join(', ') : "None";
    }
}

module.exports = getEmotion;