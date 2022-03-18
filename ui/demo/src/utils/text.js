const UtilsText = {};

UtilsText.getTextHSBA = (key) => {
    switch (key) {
        case "BAKB": 
            return "Khám bệnh";
        case "BADT":
            return "Điều trị";
        case "BAKBDT":
            return "Khám bệnh & điều trị";
        default: 
            return "";
    }
}

UtilsText.getTextSection = (key) => {
    switch (key) {
        case "khamBenh": 
            return "Khám bệnh"
        default: 
            return "";
    }
}

UtilsText.getTextSubSection = (key) => {
    switch (key) {
        case "khamToanThan": 
            return "Khám toàn thân"
        default: 
            return "";
    }
}

UtilsText.mask = (str, pattern) => {
    var i = 0;
    return pattern.replace(/#/g, _ => str[i++]);
}

UtilsText.getOriginalWordList = (text, detection) => {
    const original = text.split(' '), detected = detection.split(' '), txt = [];
    detected.forEach((word, id) => {
        if (word.includes("<mask>")) {
            var start = 0, endWord = word.length, endOriginal = original[id].length;
            while (word[start] === original[id][start]) start++;
            while (word[endWord - 1] === original[id][endOriginal - 1]) {
                endWord--;
                endOriginal--;
            }
            txt.push(original[id].slice(start, endOriginal));
        }
    })
    return txt;
}

export default UtilsText;