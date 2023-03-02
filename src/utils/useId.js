const useId = () => {
  return sessionStorage.getItem("driverId") ?? false;
};

export default useId;
