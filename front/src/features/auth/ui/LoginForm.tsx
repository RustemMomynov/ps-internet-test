"use client";

import { gql, useMutation } from "@apollo/client";
import { Form, Input, Button } from "antd";
import { useRouter } from "next/navigation";
import { LOGIN_MUTATION } from "../api/authApi";

type FormValuesTyle = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const router = useRouter();

  const handleLogin = async ({ username, password }: FormValuesTyle) => {
    try {
      const receivedToken = await loginMutation({
        variables: { username, password },
      });

      const token = receivedToken.data.login;

      await fetch("/api/auth/set-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{
        remember: true,
        username: "admin",
        password: "Qwerty123",
      }}
      onFinish={handleLogin}
      layout="vertical"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input value={"admin"} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password value={"Qwerty123"} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
