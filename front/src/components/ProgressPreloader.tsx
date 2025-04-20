import { Progress } from "antd";
import useLoadingStore from "@/bll/LoadingStore";

export const ProgressPreloader = () => {
  const { isLoading } = useLoadingStore();

  return (
    <Progress
      percent={100}
      showInfo={false}
      status="active"
      strokeColor="#1890ff"
      strokeLinecap="butt"
      style={{
        position: "relative",
        top: "-15px",
        opacity: isLoading ? 1 : 0,
        borderRadius: 0,
      }}
    />
  );
};
