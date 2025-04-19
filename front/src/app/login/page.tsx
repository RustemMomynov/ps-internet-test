import LoginForm from "@/features/auth/ui/LoginForm";

const Login = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        className=""
        style={{
          width: "500px",
          backgroundColor: "rgb(226, 232, 238)",
          padding: "20px",
        }}
      >
        <h2>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
