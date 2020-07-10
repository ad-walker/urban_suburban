import React from "react";
import { PageHeader, Button, Avatar} from "antd";
import HomeIcon from "../images/icon.svg"
import { AreaChartOutlined } from "@ant-design/icons";

function NavHeader(props) {
  return (
      <PageHeader
        extra={[
          <Button type="text" size="large">
            Something
          </Button>,
          <Button type="text" size="large">
            Something
          </Button>,
          <Button type="text" size="large">
            Something
          </Button>,
          <Button type="primary" size="large">
          Something
        </Button>,
        ]}
        avatar={{ src: HomeIcon, size: "large", shape:"square"}}
      />
  );
}

export default NavHeader;
