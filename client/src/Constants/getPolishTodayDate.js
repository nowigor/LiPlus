const getPolishTodayDate = () => {
    const currentDate = new Date();
    
    const polishDaysOfWeek = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    const polishMonths = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
  
    const dayOfWeek = polishDaysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = polishMonths[currentDate.getMonth()];
  
    return `${dayOfWeek}, ${day} ${month}`;
  };
  
  export default getPolishTodayDate;