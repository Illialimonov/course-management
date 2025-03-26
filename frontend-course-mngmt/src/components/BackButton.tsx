import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="primary"
      icon={<ArrowLeftOutlined />}
      onClick={() => navigate(-1)}
      style={{
        marginBottom: 16,
        backgroundColor: "#1677ff",
        borderColor: "#1677ff",
        borderRadius: 6,
      }}
    >
      Go Back
    </Button>
  );
};

export default BackButton; // ✅ You need this to use it in another file
