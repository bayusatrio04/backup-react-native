import axios from 'axios';
import moment from 'moment-timezone';
import fetchlatestAbsensiLog from './index';

export const fetchData = async (setLatestTime, setHasCheckedInToday, setLatestStatus, setLoading) => {
  try {
    const data = await fetchlatestAbsensiLog();
    if (data && data.waktu_absensi) {
      const latestTime = data.waktu_absensi;
      setLatestTime(latestTime);
      const currentDate = moment().format('YYYY-MM-DD');
      if (data.tanggal_absensi === currentDate) {
        setHasCheckedInToday(true);
        setLatestStatus(data.id_absensi_status);
      } else {
        setHasCheckedInToday(false);
        setLatestTime('-- : -- : --');
      }
    } else {
      console.log('Tidak ada data absensi hari ini');
      setLatestTime('-- : -- : --');
      setHasCheckedInToday(false);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
