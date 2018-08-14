import Axios from "@/vendor/axios";
const axiosApi = new Axios();

function Friend() {}

Friend.prototype.fetch = (page, step) => {
  return new Promise((resolve, reject) => {
    axiosApi
      .post("/api/friend/fetch", {
        page,
        step
      })
      .then(res => {
        if (res.data.code === 0) resolve(res.data.results);
        else reject(new Error(res.data.msg));
      })
      .catch(error => reject(error));
  });
};

export default Friend;
