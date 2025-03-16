import axios from "axios";

const fetchJishoData = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/jisho"); // เปลี่ยนเป็น URL ของ proxy server
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default fetchJishoData;
