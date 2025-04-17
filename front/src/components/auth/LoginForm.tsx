"use client";

import { gql, useMutation } from "@apollo/client";
import { Form, Input, Button } from "antd";

type FormValuesTyle = {
  username: string;
  password: string;
};

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const LoginForm = () => {
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const handleLogin = async ({ username, password }: FormValuesTyle) => {
    try {
      const receivedToken = await loginMutation({
        variables: { username, password },
      });
      console.log(receivedToken.data.login);
      localStorage.setItem("token", receivedToken.data.login);
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
