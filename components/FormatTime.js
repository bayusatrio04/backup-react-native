

export const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNumber = parseInt(hour, 10); 
    const ampm = hourNumber >= 12 ? 'PM' : 'AM'; 
    const formattedHour = hourNumber % 12 || 12; 
    return `${formattedHour}:${minute} ${ampm}`;
  };
  
  export const getCurrentFormattedTime = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    return formatTime(formattedTime);
  };
  