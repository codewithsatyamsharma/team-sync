import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { loginEmployee, registerEmployee } from "../state/auth/authAction";

export let useAuth = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegisterSubmit = async (data) => {
    const result = await dispatch(registerEmployee(data));
    if (registerEmployee.fulfilled.match(result)) navigate("/home");
  };

  const onLoginSubmit = async (data) => {
    const result = await dispatch(loginEmployee(data));
    if (loginEmployee.fulfilled.match(result)) navigate("/home");
  };

  return {
    register,
    handleSubmit,
    errors,
    error,
    isLoading,
    onRegisterSubmit,
    onLoginSubmit,
    navigate,
  };
};
