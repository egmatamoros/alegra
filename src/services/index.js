import axios from "axios";

const baseUrlAlegra = "https://api.alegra.com/api/v1";
const urlGoogle = "https://customsearch.googleapis.com/customsearch/v1";

export const getImages = async (query, number) => {
  try {
    const result = await axios.get(`${urlGoogle}`, {
      params: {
        key: process.env.VUE_APP_GOOGLE_API_KEY,
        cx: process.env.VUE_APP_CX,
        q: query,
        searchType: "image",
        num: number,
      },
    });
    console.log(result);

    if (result.data) {
      return result.data.items;
    } else return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSellers = async () => {
  try {
    const result = await axios.get(`${baseUrlAlegra}/sellers`, {
      headers: {
        accept: "application/json",
        authorization: `Basic ${process.env.VUE_APP_TOKEN_ALEGRA}`,
      },
    });
    console.log(result);
    if (result.data) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createInvoice = async (data) => {
  try {
    const result = await axios.post(`${baseUrlAlegra}/invoices`, data, {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Basic ${process.env.VUE_APP_TOKEN_ALEGRA}`,
      },
    });
    console.log(result);
    if (result.data) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
