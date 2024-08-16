import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const decodeJwt = () => {
  const token = Cookies.get("jwtToken");

  if (token) {
    const decodedToken = jwtDecode(token);

    return decodedToken;
  }

  return null;
};

export default decodeJwt;
