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

UtilsText.mask = (str, pattern) => {
    var i = 0;
    return pattern.replace(/#/g, _ => str[i++]);
}

export default UtilsText;