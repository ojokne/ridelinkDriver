const useToken = () => {
  return sessionStorage.getItem("driverToken") ?? false;
};

export default useToken;
