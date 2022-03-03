const UtilsDateTime = {};

UtilsDateTime.getAge = (dateOfBirth) => {
    const now = new Date(), then = new Date(dateOfBirth);

    return now.getFullYear() - then.getFullYear() - (now < new Date(now.getFullYear(), then.getMonth(), then.getDate()));
}

export default UtilsDateTime;