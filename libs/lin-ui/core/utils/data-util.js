class DataUtil {
  setDiffData(t, a) {
    const e = {};
    Object.keys(a).forEach((s) => {
      t.data[s] !== a[s] && (e[s] = a[s]);
    }),
      Object.keys(e).length && t.setData(e);
  }
}
const dataUtil = new DataUtil();
export default dataUtil;
