const UtilsRole = {};

UtilsRole.getRoleText = (role) => {
    switch (role) {
        case "BN": 
            return "Bệnh nhân";
        case "BS":
            return "Bác sĩ";
        case "DD":
            return "Điều dưỡng";
        default: 
            return "";
    }
}

export default UtilsRole;