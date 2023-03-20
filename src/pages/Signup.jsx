import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Logo from "../components/Logo";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  const [permitNumber, setPermitNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [permitNumberError, setPermitNumberError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [ninError, setNinError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const showPasswordRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    alert: false,
    message: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!permitNumber.length) {
      setPermitNumberError("Permit Number is required");
      return;
    }
    if (!nin.length) {
      setPermitNumberError("NIN is required");
      return;
    }
    if (phone.length < 10) {
      setPhoneError("Should be atleast 10 characters");
      return;
    }
    if (!email.length) {
      setEmailError("Email is required");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password should be atleast 6 characters");
      return;
    }

    try {
      setLoading(true);
      let user = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "eDrivers", user.user.uid), {
        permitNumber,
        nin,
        phone,
        email,
        isAvailable: true,
      });
      setLoading(false);
      navigate("/");
    } catch (e) {
      setLoading(false);
      console.log(e.code);
      const errorCode = e.code;

      switch (errorCode) {
        case "auth/email-already-in-use":
          setAlert((prev) => {
            return { ...prev, alert: true, message: "Email already in use" };
          });
          break;

        case "auth/weak-password":
          setAlert((prev) => {
            return { ...prev, alert: true, message: "Weak password" };
          });
          break;
        default: {
          setAlert((prev) => {
            return { ...prev, alert: true, message: "An error occured" };
          });
        }
      }
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

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       navigate("/");
  //     }
  //     setLoading(false);
  //   });
  // }, [navigate]);
  if (loading) {
    return <Loader loading={loading} description="Loading" />;
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
                value={permitNumber}
                onChange={(e) => {
                  setPermitNumber(e.target.value);
                  setPermitNumberError("");
                }}
                required
              />
              {permitNumberError && (
                <div
                  className="text-danger small my-2"
                  style={{ fontSize: ".6em" }}
                >
                  <span>{permitNumberError}</span>
                </div>
              )}
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
                value={nin}
                onChange={(e) => {
                  setNin(e.target.value);
                  setNinError("");
                }}
                required
              />
              {ninError && (
                <div
                  className="text-danger small my-2"
                  style={{ fontSize: ".6em" }}
                >
                  <span>{ninError}</span>
                </div>
              )}
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
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError("");
                }}
                required
              />
              {phoneError && (
                <div
                  className="text-danger small my-2"
                  style={{ fontSize: ".6em" }}
                >
                  <span>{phoneError}</span>
                </div>
              )}
            </div>
            <div className="m-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="oen@example.com"
                required
              />
              {emailError && (
                <div
                  className="text-danger small my-2"
                  style={{ fontSize: ".6em" }}
                >
                  <span>{emailError}</span>
                </div>
              )}
            </div>
            <div className="m-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                ref={passwordRef}
                required
              />
              {passwordError && (
                <div
                  className="text-danger small my-2"
                  style={{ fontSize: ".6em" }}
                >
                  <span>{passwordError}</span>
                </div>
              )}
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
              onClick={(e) => handleSignup(e)}
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
