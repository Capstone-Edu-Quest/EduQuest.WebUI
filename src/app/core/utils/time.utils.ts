export const formatTime = (inputTime: any): string => {
    if (!inputTime) return '';

    const time = new Date(inputTime);
    const formattedTime = time.toLocaleDateString();
    const timeArr = formattedTime.split('/');
    timeArr.forEach((t, i) => {
        if (t.length === 1) {
            timeArr[i] = `0${t}`;
        }
    });

    return timeArr.join('/');
}

export const getNumberOfDatesInMonth = (currentYear?: number): number[] => {
    const _currentYear = currentYear ?? new Date().getFullYear();

    const monthDates: number[] = [];

    for (let i = 1; i <= 12; i++) {
        if (i <= 7) {
            if (i === 2) {
                monthDates.push(_currentYear % 4 === 0 ? 29 : 28);
            } else {
                monthDates.push(i % 2 === 0 ? 30 : 31);
            }
        } else {
            monthDates.push(i % 2 === 0 ? 31 : 30);
        }
    }

    // [Jan, Feb, Mar,....]
    return monthDates
}

export const getDayByDates = (date: number, month: number, year: number): number => {
    const _date = new Date(year, month - 1, date);

    // 7: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
    return _date.getDay() || 7;
};

export const onCorrectTime = (time: string): string => {
    let returnedTime = time;
    const numberOfDateInThisMonth = getNumberOfDatesInMonth(handleCastDateString(returnedTime).year);

    if (handleCastDateString(returnedTime).date > numberOfDateInThisMonth[handleCastDateString(returnedTime).month - 1]) {
        const difference = handleCastDateString(returnedTime).date - numberOfDateInThisMonth[Number(handleCastDateString(returnedTime).month) - 1];
        returnedTime = `${difference}/${handleCastDateString(returnedTime).month + 1}/${handleCastDateString(returnedTime).year}`;
    }

    if (handleCastDateString(returnedTime).date < 1) {
        let monthIdx = Number(handleCastDateString(returnedTime).month) - 2;
        monthIdx = monthIdx >= 0 ? monthIdx : 11 - 2;

        const difference = handleCastDateString(returnedTime).date + numberOfDateInThisMonth[monthIdx];
        returnedTime = `${difference}/${handleCastDateString(returnedTime).month - 1}/${handleCastDateString(returnedTime).year}`;
    }

    if (handleCastDateString(returnedTime).month > 12) {
        const difference = handleCastDateString(returnedTime).month - 12;
        returnedTime = `${handleCastDateString(returnedTime).date}/${difference}/${handleCastDateString(returnedTime).year + 1}`;
    }

    if (handleCastDateString(returnedTime).month < 1) {
        const difference = handleCastDateString(returnedTime).month + 12;
        returnedTime = `${handleCastDateString(returnedTime).date}/${difference}/${handleCastDateString(returnedTime).year - 1}`;
    }

    return returnedTime !== time ? onCorrectTime(returnedTime) : returnedTime;
}

export const handleCastDateString = (dateString: string) => {
    const [date, month, year] = dateString.split('/');

    return { date: Number(date), month: Number(month), year: Number(year) }
}

export const onGetLabelByDay = (day: number, isShort: boolean): string => {
    switch (day) {
        case 1:
            return isShort ? 'T2' : 'Thứ 2';
        case 2:
            return isShort ? 'T3' : 'Thứ 3';
        case 3:
            return isShort ? 'T4' : 'Thứ 4';
        case 4:
            return isShort ? 'T5' : 'Thứ 5';
        case 5:
            return isShort ? 'T6' : 'Thứ 6';
        case 6:
            return isShort ? 'T7' : 'Thứ 7';
        case 7:
            return isShort ? 'CN' : 'Chủ nhật';
        default:
            return '';
    }
}

export const onAddZeroToTime = (time: number): string => {
    return time < 10 ? `0${time}` : time.toString();
}
