import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Logo from "../components/Logo";

const Signup = () => {
  const navigate = useNavigate();
  const showPasswordRef = useRef();
  const permitNumberRef = useRef();
  const ninRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
  });

  const handleSignup = async (
    e,
    permitNumber,
    nin,
    phoneNumber,
    email,
    password
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/driver/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permitNumber,
          nin,
          phoneNumber,
          email,
          password,
          role: 1,
        }),
        credentials: "include",
      });
      const data = await res.json();
      setLoading(false);

      if (data.isCreated) {
        navigate("/login");
        setAlert((prev) => {
          return { ...prev, alert: false, message: "" };
        });
      } else {
        setAlert((prev) => {
          return { ...prev, alert: true, message: data.msg };
        });
      }
    } catch {
      console.log("An error occured");
      setAlert((prev) => {
        return {
          ...prev,
          alert: true,
          message: "An error occurred, Please try again",
        };
      });
    }
  };
  const handleShowPassword = () => {
    let passwordField = passwordRef.current;
    if (passwordField.type === "password") {
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
    }
  };
  if (loading) {
    return (
      <Loader
        loading={loading}
        description="We are creating your account, please wait"
      />
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "500px" }}>
      <div className="bg-white rounded  shadow-sm m-3 p-3">
        <Logo />
        {alert.alert && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        <div>
          <p className="text-center text-muted">Please give us your details</p>

          <form>
            <div className="m-3">
              <label htmlFor="permitNumber" className="form-label">
                Permit Number
              </label>
              <input
                type="text"
                className="form-control"
                id="permitNumber"
                placeholder="1234TM"
                ref={permitNumberRef}
                required
              />
            </div>
            <div className="m-3">
              <label htmlFor="nin" className="form-label">
                NIN
              </label>
              <input
                type="text"
                className="form-control"
                id="nin"
                placeholder="CM1005969XPHASZ"
                ref={ninRef}
                required
              />
            </div>
            <div className="m-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="+256 712345678"
                ref={phoneRef}
                required
              />
            </div>
            <div className="m-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                ref={emailRef}
                placeholder="oen@example.com"
                required
              />
            </div>
            <div className="m-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                ref={passwordRef}
                required
              />
            </div>
            <div className="m-3 form-check">
              <input
                ref={showPasswordRef}
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                onChange={() => handleShowPassword()}
              />
              <label className="form-check-label" htmlFor="showPassword">
                show password
              </label>
            </div>
            <button
              type="submit"
              className="m-3 btn ridelink-background text-white "
              onClick={(e) =>
                handleSignup(
                  e,
                  permitNumberRef.current.value,
                  ninRef.current.value,
                  phoneRef.current.value,
                  emailRef.current.value,
                  passwordRef.current.value
                )
              }
            >
              Create my account
            </button>
            <div className="m-3">
              <Link to="/login" className="text-decoration-none ridelink-color">
                Login to my account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
